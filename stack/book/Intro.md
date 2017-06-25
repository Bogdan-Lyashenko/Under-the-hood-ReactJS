# Intro

### Scheme, first look


[![](../images/intro/all-page-stack-reconciler-25-scale.jpg)](../images/intro/all-page-stack-reconciler.svg)
<em>1.0 All scheme (click to open in big size)</em>

So.. have a look. Take your time. Of course, overall it looks complex, but in fact, it describes only two processes: mount and update. I skip unmount because it’s kind of ‘reversed mount’, so, I’ve just decided to simplify scheme. Also, in fact, this is not 100% match of code, but just major pieces which describe the architecture, so, it’s rather 60% of the code, but other 40% in fact almost don’t bring any value, so, I omitted them to make it simple.

Alright, probably you have already noticed many colors on the scheme, each logic item (shape on the scheme) is highlighted in parent module color, it means, for example, ‘methodA’ will be red if it’s called from ‘moduleB’ which is red. Let’s see modules legend for the scheme, it describes module color and path to the file as well.

![](https://cdn.rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/14364cbd/part-1/images/intro/modules-src-path.svg)

<em>1.1 Modules colors</em>

Let’s put them into a scheme to see dependencies between modules.

[![](https://cdn.rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/14364cbd/part-1/images/intro/files-scheme.svg)](https://cdn.rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/14364cbd/part-1/images/intro/files-scheme.svg)

<em>1.2 Modules dependencies</em>

But, as you probably know, React is built to support many environments. Like mobile (ReactNative), browser (ReactDOM), also Server Rendering and ReactART(for drawing vector graphics using React) etc. So, a number of files actually is bigger than that. We can compare how actually multi-support affects the scheme.

[![](https://cdn.rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/14364cbd/part-1/images/intro/modules-per-platform-scheme.svg)](https://cdn.rawgit.com/Bogdan-Lyashenko/Under-the-hood-ReactJS/14364cbd/part-1/images/intro/modules-per-platform-scheme.svg)

So, you can see which parts were changed, it means they have separate implementation per platform. Let’s take something simple, like ReactEventListener, obviously, its implementation will be different for different platforms! Technically, as you can imagine, these platform dependent modules should be somehow injected or connected to the current logic flow, and, in fact, there are many such injectors as well. We omit them to simplify the scheme, there is nothing special in terms of coding, just standard composition pattern.

Let’s learn the logic flow for React DOM in a regular browser. It’s the most used one, and it completely covers all React’s architecture ideas, so, fair enough!


### Code sample

What is the best way to learn code? Right, read and debug the code. Alright, we are gonna to debug two processes: ReactDOM.render and component.setState, which map on mount and update. Let’s check the code we can write for a start. What do we need? Probably several small components with simple renders, so it will be easier to debug.

```javascript
class ChildCmp extends React.Component {
    render() {
        return <div> {this.props.childMessage} </div>
    }
}

class ExampleApplication extends React.Component {
    constructor(props) {
        super(props);
        this.state = {message: 'no message'};
    }

    componentWillMount() {
        //...
    }

    componentDidMount() {
        /* setTimeout(()=> {
            this.setState({ message: 'timeout state message' });
        }, 1000); */
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return true;
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        //...
    }

    componentWillReceiveProps(nextProps) {
        //...
    }

    componentWillUnmount() {
        //...
    }

    onClickHandler() {
        /* this.setState({ message: 'click state message' }); */
    }

    render() {
        return <div>
            <button onClick={this.onClickHandler.bind(this)}> set state button </button>
            <ChildCmp childMessage={this.state.message} />
            And some text as well!
        </div>
    }
}

ReactDOM.render(
    <ExampleApplication hello={‘world’} />,
    document.getElementById('container'),
    function() {}
);
```