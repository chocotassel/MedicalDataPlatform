import { ExpandOutlined } from '@ant-design/icons';
import { Radio, Select, Slider, Button, InputNumber, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setType, setColor, setSize, setContrast } from '../store/modules/toolState';
import { setX, setY, setZ } from '../store/modules/pointPosState';
import { setScaleFactor } from '../store/modules/scaleFactorState'
import {Link} from 'react-router-dom';
  
const App = () => {
  // Redux
  const { x, y, z } = useSelector((state) => state.pointPos)
  const { xSize, ySize, zSize } = useSelector((state) => state.modelSize)
  const { color, size, contrast } = useSelector((state) => state.tool)
  const scaleFactor =useSelector((state) => state.scaleFactor.value)
  const dispatch = useDispatch();
  // DOM
  return (
    <div style={{display:'inline-block',height:'900px',minWidth:'320px',backgroundColor:'#fff',padding:'0 10px'}}>
      <h3>工具</h3>
      <Radio.Group onChange={(e) => dispatch(setType(e.target.value))}>
        <Radio.Button value={0}>拖动</Radio.Button>
        <Radio.Button value={1}>画笔</Radio.Button>
        <Radio.Button value={2}>橡皮擦</Radio.Button>
        <Radio.Button value={3}>多边形</Radio.Button>
        <Radio.Button value={4}>尺子</Radio.Button>
      </Radio.Group>
      <h3>缩放</h3>
        <Row>
          <Col span={18}>
            <Slider
              min={ 0 }
              max={ 100 }
              style={{ marginLeft: 20 }}
              value={scaleFactor * 100}
              onChange={(e)=>dispatch(setScaleFactor(e/100))}
            />
          </Col>
          <Col>
            <InputNumber
              min={ 0 }
              max={ 1 }
              style={{
                width: 60,
                marginLeft: 20
              }}
              value={scaleFactor * 100}
              onChange={(e)=>dispatch(setScaleFactor(e/100))}
            />
          </Col>
        </Row>
      <h3>位置</h3>
      <Row>
        <span style={{lineHeight:'34px'}}>X</span>
        <Col span={18}>
          <Slider
            min={ 0 }
            max={ xSize - 1}
            style={{marginLeft:10}}
            value={x}
            onChange={(e)=>dispatch(setX(e))}
          />
        </Col>
        <Col>
          <InputNumber
            min={ 0 }
            max={ xSize - 1}
            style={{
              width: 60,
              marginLeft: 10
            }}
            value={x}
            onChange={(e)=>dispatch(setX(e))}
          />
        </Col>
      </Row>
      <Row>
        <span style={{lineHeight:'34px'}}>Y</span>
        <Col span={18}>
          <Slider
            min={ 0 }
            max={ ySize - 1 }
            style={{marginLeft:10}}
            onChange={(e)=>dispatch(setY(e))}
            value={typeof y === 'number' ? y : 0}
          />
        </Col>
        <Col>
          <InputNumber
            min={ 0 }
            max={ ySize - 1 }
            style={{
              width: 60,
              marginLeft: 10
            }}
            value={y}
            onChange={(e)=>dispatch(setY(e))}
          />
        </Col>
      </Row>
      <Row>
        <span style={{lineHeight:'34px'}}>Z</span>
        <Col span={18}>
          <Slider
            min={ 0 }
            max={ zSize - 1 }
            style={{marginLeft:10}}
            onChange={(e)=>dispatch(setZ(e))}
            value={typeof z === 'number' ? z : 0}
          />
        </Col>
        <Col>
          <InputNumber
            min={ 0 }
            max={ zSize - 1 }
            style={{
              width: 60,
              marginLeft: 10
            }}
            value={z}
            onChange={(e)=>dispatch(setZ(e))}
          />
        </Col>
      </Row>
      {/* 画笔颜色 */}
      <div id='color' 
        style={{
        display: 'inline-block',
        marginRight: 5,
        backgroundColor: color,
        width: 10,
        height: 10
        }}>
      </div>
      <Select
        defaultValue={color}
        style={{
          width: 100,
          marginRight: 10
        }}
        onChange={(e)=>dispatch(setColor(e))}
        options={[
          {
            value: '#ff0000',
            label: 'Red',
          },
          {
            value: '#0000ff',
            label: 'Blue',
          },
          {
            value: '#00ff00',
            label: 'Green',
          }
        ]}
      />
      {/* 画笔粗细 */}
      <Select
          defaultValue={size}
          style={{
            width: 100,
            marginRight: 10
          }}
          onChange={(e)=>dispatch(setSize(e))}
          options={[
            {
              value: 2,
              label: '4',
            },
            {
              value: 4,
              label: '8',
            },
            {
              value: 8,
              label: '16',
            },
            {
              value: 16,
              label: '32',
            },
          ]}
        />
      {/* 色系 */}
      <Select
        defaultValue={contrast}
        style={{
          width: 100,
        }}
        onChange={(e)=>dispatch(setContrast(e))}
        options={[
          {
            value: 'gray',
            label: '灰度',
          },
          {
            value: 'rainbow',
            label: '多彩',
          },
          {
            value: 'cool',
            label: '清逸',
          },
          {
            value: 'warm',
            label: '暖意',
          },
          {
            value: 'spring',
            label: '春韵',
          },
          {
            value: 'summer',
            label: '酣夏',
          },
          {
            value: 'autumn',
            label: '金秋',
          },
          {
            value: 'winter',
            label: '素冬',
          }
        ]}
      />
      <h3>数据分析</h3>
      <span>器官数量:16</span>
      <span>直径x:16</span>
      <br />
      <span>直径y:16</span>
      <span>直径z:16</span>
      <br />
      <br />
      {/* 上传 */}
      <Link to='/upload'><Button type='primary '>上传</Button></Link>
    </div>
  );
};
export default App;