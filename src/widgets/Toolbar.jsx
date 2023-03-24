import { DownOutlined, ExpandOutlined } from '@ant-design/icons';
import { Dropdown, Radio, Select, Slider, Space, Button, InputNumber, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setType, setColor, setSize } from '../store/modules/toolState';
import { setX, setY, setZ } from '../store/modules/pointPosState';
import {Link} from 'react-router-dom';
  
const App = () => {
  // Redux
  const { x, y, z } = useSelector((state) => state.pointPos)
  const { xSize, ySize, zSize } = useSelector((state) => state.modelSize)
  const { color, size } = useSelector((state) => state.tool)
  const dispatch = useDispatch();
  // 分割结果
  const items = [
    { label: '腹腔', key: '1' },
    { label: '前列腺/子宫', key: '2' },
    { label: '脾脏', key: '3' },
    { label: '右肾', key: '4' },
    { label: '左肾', key: '5' },
    { label: '胆囊', key: '6' },
    { label: '食道', key: '7' },
    { label: '肝', key: '8' },
    { label: '胃', key: '9' },
    { label: '主动脉', key: '10' },
    { label: '下腔静脉', key: '11' },
    { label: '胰腺', key: '12' },
    { label: '右肾上腺', key: '13' },
    { label: '左肾上腺', key: '14' },
    { label: '十二指肠', key: '15' },
    { label: '膀胱', key: '16' },
  ];


  return (
    <div style={{display:'inline-block',height:'900px',minWidth:'320px',backgroundColor:'#fff',padding:'0 10px'}}>
      <h3>工具</h3>
      <Radio.Group onChange={(e) => dispatch(setType(e.target.value))}>
        <Radio.Button value={0}>拖动</Radio.Button>
        <Radio.Button value={1}>画笔</Radio.Button>
        <Radio.Button value={2}>橡皮擦</Radio.Button>
        <Radio.Button value={3}><ExpandOutlined /></Radio.Button>
        <Radio.Button value={4}>尺子</Radio.Button>
      </Radio.Group>
      <br />
      <br />
      {/* 滑动输入 */}
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
              width: 50,
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
              width: 50,
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
              width: 50,
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
            value: 'red',
            label: 'Red',
          },
          {
            value: 'blue',
            label: 'Blue',
          },
          {
            value: 'green',
            label: 'Green',
          }
        ]}
      />
      {/* 画笔粗细 */}
      <Select
          defaultValue={size}
          style={{
            width: 100,
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
        {/* <br />
        <br />
      <Radio.Group>
        <Button>上一帧</Button>
        <Button>下一帧</Button>
      </Radio.Group> */}
      <h3>数据分析</h3>

      {/* 分割结果 */}
      <Dropdown
      menu={{
        items,
      }}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <h3>分割结果</h3>
          <DownOutlined />
        </Space>
      </a>
      </Dropdown>
      <br />
      {/* 上传 */}
      <Link to='/upload'><Button type='primary '>上传</Button></Link>
    </div>
  );
};
export default App;