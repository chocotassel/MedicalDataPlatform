import { Menu } from 'antd';
import { useDispatch } from 'react-redux';
import { setTrue,setFalse } from '../store/modules/organState';

// 分割结果
const items = [
  { label: '腹腔', key: '0' },
  { label: '脾脏', key: '1' },
  { label: '右肾', key: '2' },
  { label: '左肾', key: '3' },
  { label: '胆囊', key: '4' },
  { label: '食道', key: '5' },
  { label: '肝', key: '6' },
  { label: '胃', key: '7' },
  { label: '主动脉', key: '8' },
  { label: '下腔静脉', key: '9' },
  { label: '胰腺', key: '10' },
  { label: '右肾上腺', key: '11' },
  { label: '左肾上腺', key: '12' },
  { label: '十二指肠', key: '13' },
  { label: '膀胱', key: '14' },
  { label: '前列腺/子宫', key: '15' },
];

const App = () => {
  const dispatch=useDispatch()
  return (
    <Menu
      style={{
        width: 256
      }}
      defaultSelectedKeys={['0']}
      mode="inline"
      items={items}
      multiple={true}
      onDeselect={(e)=>dispatch(setFalse(e.key))}
      onSelect={(e)=>dispatch(setTrue(e.key))}
    />
  );
};
export default App;
