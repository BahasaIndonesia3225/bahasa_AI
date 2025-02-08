import React, { useState, useEffect, useRef, forwardRef  } from 'react';
import { useNavigate } from 'umi';
import { Alert, Flex, message, Image, Col, Row, Card, List, Typography, Modal, Space } from 'antd';
import { LockFilled, UnlockOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import service from '../../services';
import QuestionType1 from './components/questionType1';
import QuestionType2 from './components/questionType2';
import QuestionType3 from './components/questionType3';
import QuestionType4 from './components/questionType4';
import "./index.less";

const MultiFruit = () => {
  //获取阶段列表
  const [stageList, setStageList] = useState([]);
  useEffect(() => { getStageListMethod() }, [])
  const getStageListMethod = async () => {
    const { rows, total } = await service.MultiFruitApi.getStageList();
    setStageList(rows);
  }
  //获取章节题目
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectionsList, setSectionsList] = useState([]);
  const showModal = () => { setIsModalOpen(true);};
  const getSectionsListMethod = async (id, flag) => {
    if(flag === 0) {
      message.warning('请先完成前面的关卡');
      return
    }
    const { data = [] } = await service.MultiFruitApi.getSectionsList({category: id});
    setSectionsList(data)
    showModal()
  }
  const handleOk = () => {
    // setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <PageContainer
      title={<div className="gradient-text">印尼语东仔</div>}>
      <div className='MultiFruit'>
        <Row gutter={[16, 16]}>
          {
            stageList.map((item, index) => {
              const {id, name, introduce, pic, children} = item;
              return (
                <Col key={id} xs={24} sm={24} md={12} lg={8} xl={6}>
                  <Card title={`${index + 1}. ${name}`}>
                    <Alert
                      style={{ marginBottom: 16 }}
                      message={introduce}
                      type="success"
                    />
                    <Flex
                      gap={16}
                      justify="pace-between"
                      align="flex-start">
                      <Image
                        width={80}
                        height={80}
                        src={pic}
                        preview={true}
                      />
                      {
                        children && (!!children.length) ? (
                          <List
                            style={{ flex: 1 }}
                            bordered
                            size="small"
                            dataSource={children}
                            renderItem={({id, name, introduce, flag}, index) => (
                              <List.Item
                                style={{ cursor: 'pointer' }}
                                key={id}
                                onClick={() => getSectionsListMethod(id, flag)}>
                                <Typography.Text>{name}</Typography.Text>
                                {(flag === 0) ?
                                  <LockFilled style={{ fontSize: '16px', color: '#1677ff' }}/> :
                                  <UnlockOutlined style={{ fontSize: '16px', color: '#ff4d4f' }} />}
                              </List.Item>
                            )}>
                          </List>
                        ) : ''
                      }
                    </Flex>
                  </Card>
                </Col>
              )
            })
          }
        </Row>
        <Modal
          width={{ xs: '90%', sm: '90%', md: 600, lg: 800, xl: 800, xxl: 800 }}
          title="请回答以下题目"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}>
          <Row gutter={[16, 16]}>
            {
              sectionsList.map((item, index) => {
                //听写1、翻译2、选图3、选词4
                const { id, title, analysis, type, url, questionOptions } = item;
                //根据type类型，渲染不同类型组件
                let RenderComponent = null;
                if(type === '1') RenderComponent = <QuestionType1 key={id} data={item} />;
                if(type === '2') RenderComponent = <QuestionType2 key={id} data={item} />;
                if(type === '3') RenderComponent = <QuestionType3 key={id} data={item} />;
                if(type === '4') RenderComponent = <QuestionType4 key={id} data={item} />;
                return (
                  <Col key={id} xs={24} sm={24} md={12} lg={12} xl={12}>
                    {RenderComponent}
                  </Col>
                )
              })
            }
          </Row>
        </Modal>
      </div>
    </PageContainer>
  )
}

export default MultiFruit;
