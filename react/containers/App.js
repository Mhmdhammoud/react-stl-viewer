import React, { Component } from 'react';
import STLViewer from '../../src/STLViewer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'rgba(255,0,48,0.2)',
      model: undefined,
      sliders: [
        {
          index: 0,
          value: 0.2,
        },
        {
          index: 0,
          value: 1,
        },
      ],
    };

    this.clickBlue = this.clickBlue.bind(this);
    this.clickRed = this.clickRed.bind(this);
  }

  clickBlue(e) {
    e.preventDefault();
    this.setState({ color: '#0000FF' });
  }

  clickRed(e) {
    e.preventDefault();
    this.setState({ color: '#FF0000' });
  }

  onChange = ({ target }) => {
    const { files } = target;
    const reader = new FileReader();
    reader.readAsArrayBuffer(files[0]);
    reader.onload = () => {
      this.setState({ model: reader.result });
    };
  };
  render() {
    return (
      <div>
        <input id="image-file" type="file" onChange={this.onChange} />
        <input
          type="range"
          min={0.0}
          max={1.0}
          step={0.1}
          onChange={(e) => {
            this.setState({
              sliders: [
                { index: 0, value: parseFloat(e.target.value) },
                { index: 1, value: this.state.sliders[1].value },
              ],
            });
          }}
        />
        <input
          type="range"
          min={0.0}
          max={1.0}
          step={0.1}
          onChange={(e) => {
            this.setState({
              sliders: [
                { index: 0, value: this.state.sliders[0].value },
                { index: 1, value: parseFloat(e.target.value) },
              ],
            });
          }}
        />
        <STLViewer
          modelColor={this.state.color}
          lights={[1, 1]}
          rotate={false}
          model={this.state.model}
          sliders={this.state.sliders}
        />
        <button onClick={this.clickRed}>red</button>
        <button onClick={this.clickBlue}>blue</button>
      </div>
    );
  }
}
export default App;
