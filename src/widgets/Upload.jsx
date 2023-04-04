import { UploadOutlined,MinusOutlined,PlusOutlined } from '@ant-design/icons';
import { Button, Upload, Row, Col, Progress, Space, Spin } from 'antd';
import { useState, useEffect } from 'react';


const App = () => {
  
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(0);
  const increase = () => {
    setPercent((prevPercent) => {
      const newPercent = prevPercent + 1;
      if (newPercent > 100) {
        return 100;
      }
      return newPercent;
    });
  };


  useEffect(() => {  
    if(loading)
      setTimeout(()=>{increase()},1000)
    });
  
  return(
    <Row style={{width:'100%',marginTop:'180px'}}>
      <Col span={20} offset={2}>
        {(!loading)?(<Col span={2} offset={10}>
          <Upload
            listType="picture"
            maxCount={2}
            customRequest={()=>setLoading(true)}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
          </Col>):(<></>)
        }
        {
          loading ? (
              <Progress percent={percent} status="active" />
              // <Space wrap>
              //   <Progress
              //     type="circle"
              //     percent={percent}
              //   />
              // </Space> 
          ) : ( <></> )
        }
        <br />
        <br />
        <br />
        {
          (percent!=100 && loading) ? (
            <Spin tip="AI计算中" size="large">
              <div className="content" />
            </Spin>
          ) : ( <></> )
        }
      </Col>
      
    </Row>
  )
}
export default App;