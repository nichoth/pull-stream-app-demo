import { h, render } from 'preact'
var toStream = require('preact-pull-stream')
var renderApp = require('./view')
var _ = require('pull-stream-util')
var S = require('pull-stream')
var compose = require('@f/compose')

var AppView = toStream(renderApp.events, renderApp)

function StringState () {
    return { hello: 'world' }
}

StringState.update = {
    foo: (state, ev) => ({ hello: 'foo' }),
    bar: (state, ev) => ({ hello: 'bar' }),
    baz: (state, ev) => ({ hello: 'baz' })
}

function echo (data, cb) {
    setTimeout(cb.bind(null, null, data), 1000)
}

function Effects () {
    return {
        echo: _.chain(compose(
            _.HTTP.fromCb(echo),
            () => 'foo'
        ))
    }
}

var echoState = {
    resolving: 0,
    resolved: []
}
function echoUpdate (state, ev) {
    if (ev.type === 'start') {
        return {
            resolving: state.resolving + 1,
            resolved: state.resolved
        }
    }

    if (ev.type === 'resolve') {
        return {
            resolving: state.resolving - 1,
            resolved: state.resolved.concat([ev.res])
        }
    }
}


// ----------------------------------------------

function main (sources) {
    var effects = Effects()

    var echo$ = S(
        sources.foo(),
        effects.echo
    )

    var echoState$ = _.cat([
        S.once(echoState),
        S( echo$, _.scan(echoUpdate, echoState) )
    ])

    var stringState$ = _.cat([
        S.once(StringState()),
        S(
            sources(),
            _.scan(StringState.update, StringState())
        )
    ])

    return _.combineLatest({
        string: stringState$,
        echos: echoState$
    })
}

S(
    main(AppView.sources),
    AppView.sink
)

render(h(AppView.view), document.getElementById('app'))

