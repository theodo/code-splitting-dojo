import React, { Component, Fragment } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/styles/hljs";

class Highlight extends Component {
  render() {
    const codeString = `
    // Basic code splitting with React

    class MyComponent extends React.Component {
      state = {
        Bar: null
      };

      componentDidMount() {
        import('./components/Bar').then(Bar => {
          this.setState({ Bar: Bar.default });
        });
      }

      render() {
        let {Bar} = this.state;
        if (!Bar) {
          return <div>Loading...</div>;
        } else {
          return <Bar/>;
        };
      }
    }
    `;
    return (
      <Fragment>
        <h1>This page is displaying some highlighted code</h1>
        <SyntaxHighlighter language="javascript" style={docco}>
          {codeString}
        </SyntaxHighlighter>
      </Fragment>
    );
  }
}

export default Highlight;
