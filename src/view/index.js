import { h } from 'preact'

function MyView (props) {
    var evs = props.events
    var state = props.state
    console.log('render', props)

    return <div class="example">
        hello {props.state.string.hello}
        <div>
            <button onClick={evs.foo}>foooooo</button>
            <button onClick={evs.bar}>bar</button>
            <button onClick={evs.baz}>baz</button>
        </div>

        <hr />

        <div class="resolving">
            resolving: {state.echos.resolving}
            <br />
            resolved: {state.echos.resolved.join(' ')}
        </div>
    </div>
}

MyView.events = [ 'foo', 'bar', 'baz' ]

module.exports = MyView

