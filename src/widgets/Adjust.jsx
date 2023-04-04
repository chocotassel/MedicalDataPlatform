import React, { useState } from 'react';
import { Col, InputNumber, Row, Slider, Dropdown, Button } from 'antd';

const items = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        nnUnet
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        Diffusion
      </a>
    ),
  }
];

const Adjust=()=>{
  const [inputValue1, setInputValue1] = useState(1);
  const onChange1 = (newValue) => {
    setInputValue1(newValue);
  };
  const [inputValue2, setInputValue2] = useState(1);
  const onChange2 = (newValue) => {
    setInputValue2(newValue);
  };
  const [inputValue3, setInputValue3] = useState(1);
  const onChange3 = (newValue) => {
    setInputValue3(newValue);
  };
  const [inputValue4, setInputValue4] = useState(1);
  const onChange4 = (newValue) => {
    setInputValue4(newValue);
  };
  return (
    <Row>
      <Col span={12} offset={5}>
      参数1
        <Slider
          min={1}
          max={20}
          onChange={onChange1}
          value={typeof inputValue1 === 'number' ? inputValue1 : 0}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={1}
          max={20}
          style={{
            margin: '0 16px',
          }}
          value={inputValue1}
          onChange={onChange1}
        />
      </Col>
      <Col span={12} offset={5}>
      参数2
        <Slider
          min={1}
          max={20}
          onChange={onChange2}
          value={typeof inputValue2 === 'number' ? inputValue2 : 0}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={1}
          max={20}
          style={{
            margin: '0 16px',
          }}
          value={inputValue2}
          onChange={onChange2}
        />
      </Col>
      <Col span={12} offset={5}>
      参数3
        <Slider
          min={1}
          max={20}
          onChange={onChange3}
          value={typeof inputValue3 === 'number' ? inputValue3 : 0}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={1}
          max={20}
          style={{
            margin: '0 16px',
          }}
          value={inputValue3}
          onChange={onChange3}
        />
      </Col>
      <Col span={12} offset={5}>
      参数4
        <Slider
          min={1}
          max={20}
          onChange={onChange4}
          value={typeof inputValue4 === 'number' ? inputValue4 : 0}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={1}
          max={20}
          style={{
            margin: '0 16px',
          }}
          value={inputValue4}
          onChange={onChange4}
        />
      </Col>
      <Col span={8} offset={8}>
        <Button type="primary" size='large' style={{marginRight:'150px'}}>重新训练</Button>
        <Dropdown
           menu={{
             items,
           }}
           placement="bottom"
         >
        <Button type="primary" size='large'>切换算法</Button>
      </Dropdown>
      </Col>
    </Row>
  );
}

export default Adjust