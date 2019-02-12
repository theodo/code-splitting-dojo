import React, { Component, Fragment } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

const options = {
  title: {
    text: "Number of javascript chunks by date"
  },
  series: [
    {
      data: [1, 2, 3, 5, 20]
    }
  ]
};

class Graph extends Component {
  render() {
    return (
      <Fragment>
        <h1>This page is displaying a graph</h1>
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"stockChart"}
          options={options}
        />
      </Fragment>
    );
  }
}

export default Graph;
