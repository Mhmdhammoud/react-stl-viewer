import React, { useState, useEffect } from 'react';
import STLViewer from './STLViewer';
import Slider from 'react-input-slider';
const App = (props) => {
  // const {
  //   rotate = false,
  //   range = false,
  //   remove = false,
  //   handleRemove = () => {},
  // } = props;
  const {
    models,
    color,
    rotate = false,
    range = false,
    remove = false,
    width,
    height,
    backgroundColor,
    className,
    handleRemove = () => {},
  } = props;
  // const [color, setColor] = useState('rgba(255,0,48,0.2)');
  // const [models, setModels] = useState([
  //   // 'https://hassans.s3.eu-central-1.amazonaws.com/youssef/order/order_g69r/impressions/order_g69rL.STL',
  //   'https://hassans.s3.eu-central-1.amazonaws.com/youssef/assets/w4fxL_OutputModel_SLA.stl',
  // ]);
  const [sliders, setSliders] = useState([]);
  useEffect(() => {
    setSliders(
      models.map((_, index) => ({
        index,
        value: 1,
      }))
    );
  }, [models]);
  if (!models || sliders.length === 0) return null;
  return (
    <div style={{ width: '400px' }}>
      <div style={{ margin: '10px 0px' }}>
        {range &&
          sliders.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  margin: '10px 0px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <input
                    type="checkbox"
                    checked={sliders[index].value > 0}
                    onClick={(e) => {
                      const newSliders = sliders.map((item, i) => {
                        if (i === index) {
                          if (e.target.checked) {
                            return { ...item, value: 1 };
                          } else {
                            return { ...item, value: 0 };
                          }
                        }
                        return item;
                      });
                      setSliders(newSliders);
                    }}
                  />
                  <Slider
                    axis="x"
                    xstep={0.1}
                    xmin={0.0}
                    xmax={1.0}
                    x={item.value}
                    onChange={({ x }) => {
                      const newSliders = sliders.map((item, i) => {
                        if (i === index) {
                          return { ...item, value: parseFloat(x) };
                        }
                        return item;
                      });
                      setSliders(newSliders);
                    }}
                    style={{ marginLeft: '20px' }}
                  />
                </div>
                {remove && (
                  <a role="button">
                    <img
                      src="https://hassans.s3.eu-central-1.amazonaws.com/assets/x11-21-2022:21:11:19.png"
                      style={{ width: '21px', cursor: 'pointer' }}
                      onClick={() => {
                        handleRemove(models[index]);
                      }}
                    />
                  </a>
                )}
              </div>
            );
          })}
      </div>
      <STLViewer
        modelColor={color}
        rotate={rotate}
        sliders={sliders}
        models={models}
        width={width}
        height={height}
        backgroundColor={backgroundColor}
        className={className}
      />
    </div>
  );
};
export default App;
