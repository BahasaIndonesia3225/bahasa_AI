import React, { useState, useEffect } from 'react';
import { useNavigate } from 'umi';
import { Alert, Flex, Divider, Button, Spin, Space, Image, Col, Row, Card, List, Typography, Modal } from 'antd';
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
  const showModal = () => { setIsModalOpen(true);};
  const handleOk = () => { setIsModalOpen(false);};
  const handleCancel = () => { setIsModalOpen(false);};
  const getSectionsListMethod = async (id, flag) => {
    const { data = [] } = await service.MultiFruitApi.getSectionsList({category: id});
    console.log(data)
    showModal()
  }

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
                                {(flag === 0) ? <LockFilled/> : <UnlockOutlined />}
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
          title="输入你听到的内容"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}>
          <QuestionType1 />
          <QuestionType2 />
          <QuestionType3 />
          <QuestionType4 />
        </Modal>
      </div>
    </PageContainer>
  )
}

export default MultiFruit;
