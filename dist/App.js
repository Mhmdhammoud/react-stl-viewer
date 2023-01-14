'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _STLViewer = require('./STLViewer');

var _STLViewer2 = _interopRequireDefault(_STLViewer);

var _reactInputSlider = require('react-input-slider');

var _reactInputSlider2 = _interopRequireDefault(_reactInputSlider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function App(props) {
  // const {
  //   rotate = false,
  //   range = false,
  //   remove = false,
  //   handleRemove = () => {},
  // } = props;
  var models = props.models,
      color = props.color,
      _props$rotate = props.rotate,
      rotate = _props$rotate === undefined ? false : _props$rotate,
      _props$range = props.range,
      range = _props$range === undefined ? false : _props$range,
      _props$remove = props.remove,
      remove = _props$remove === undefined ? false : _props$remove,
      width = props.width,
      height = props.height,
      backgroundColor = props.backgroundColor,
      className = props.className,
      _props$handleRemove = props.handleRemove,
      handleRemove = _props$handleRemove === undefined ? function () {} : _props$handleRemove;
  // const [color, setColor] = useState('rgba(255,0,48,0.2)');
  // const [models, setModels] = useState([
  //   // 'https://hassans.s3.eu-central-1.amazonaws.com/youssef/order/order_g69r/impressions/order_g69rL.STL',
  //   'https://hassans.s3.eu-central-1.amazonaws.com/youssef/assets/w4fxL_OutputModel_SLA.stl',
  // ]);

  var _useState = (0, _react.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      sliders = _useState2[0],
      setSliders = _useState2[1];

  (0, _react.useEffect)(function () {
    setSliders(models.map(function (_, index) {
      return {
        index: index,
        value: 1
      };
    }));
  }, [models]);
  if (!models || sliders.length === 0) return null;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'div',
      { style: { margin: '10px 0px' } },
      range && sliders.map(function (item, index) {
        return _react2.default.createElement(
          'div',
          {
            key: index,
            style: {
              margin: '10px 0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }
          },
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement('input', {
              type: 'checkbox',
              checked: sliders[index].value > 0,
              onClick: function onClick(e) {
                var newSliders = sliders.map(function (item, i) {
                  if (i === index) {
                    if (e.target.checked) {
                      return _extends({}, item, { value: 1 });
                    } else {
                      return _extends({}, item, { value: 0 });
                    }
                  }
                  return item;
                });
                setSliders(newSliders);
              }
            }),
            _react2.default.createElement(_reactInputSlider2.default, {
              axis: 'x',
              xstep: 0.1,
              xmin: 0.0,
              xmax: 1.0,
              x: item.value,
              onChange: function onChange(_ref) {
                var x = _ref.x;

                var newSliders = sliders.map(function (item, i) {
                  if (i === index) {
                    return _extends({}, item, { value: parseFloat(x) });
                  }
                  return item;
                });
                setSliders(newSliders);
              },
              style: { marginLeft: '20px' }
            })
          ),
          remove && _react2.default.createElement(
            'a',
            { role: 'button' },
            _react2.default.createElement('img', {
              src: 'https://hassans.s3.eu-central-1.amazonaws.com/assets/x11-21-2022:21:11:19.png',
              style: { width: '21px', cursor: 'pointer' },
              onClick: function onClick() {
                handleRemove(models[index]);
              }
            })
          )
        );
      })
    ),
    _react2.default.createElement(_STLViewer2.default, {
      modelColor: color,
      rotate: rotate,
      sliders: sliders,
      models: models,
      width: width,
      height: height,
      backgroundColor: backgroundColor,
      className: className
    })
  );
};
exports.default = App;
module.exports = exports['default'];