import React, { useState, useEffect, useRef, useCallback  } from 'react';
import { useNavigate } from 'umi';
import { Alert, Flex, message, Image, Col, Row, Card, List, Typography, Modal, Form, Input, Radio } from 'antd';
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
    try {
      const params = { pageNum: 1, pageSize: 100 }
      const { rows, total } = await service.MultiFruitApi.getStageList(params);
      setStageList(rows);
    } catch (error) {
      message.error('获取阶段列表失败，请稍后再试');
    }
  }
  //获取章节题目
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectionsList, setSectionsList] = useState([]);
  const [updateParams, setUpdateParams] = useState({ stage: undefined, node: undefined });
  const showModal = () => { setIsModalOpen(true);};
  const getSectionsListMethod = async ({sItem, sIndex, pItem, pIndex}) => {
    const {id, flag} = sItem;
    if(!((pIndex === 0 && sIndex === 0)) && flag === 0) {
      return message.warning('请先完成前面的关卡');
    }
    try {
      const { data = [] } = await service.MultiFruitApi.getSectionsList({category: id});
      setSectionsList(data)
      setUpdateParams({ stage: pItem.id, node: id });
      showModal()
    } catch (error) {
      message.error('获取章节列表失败，请稍后再试');
    }
  }
  //提交题目
  const handleOk = async () => {
    const results = sectionRefs.current.map((ref) => ref?.judgeResult?.());
    if (results.some((result) => !result)) {
      message.error('部分答案不正确，请检查后再提交');
      return;
    }
    //更新游戏进度
    await service.MultiFruitApi.updateProgress(updateParams);
    //提交成功
    setIsModalOpen(false);
    message.success('提交成功');
    //刷新页面
    getStageListMethod()
  };
  //不提交题目
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // 创建一个 ref 数组来存储每个子组件的 ref
  const sectionRefs = useRef([]);
  const saveRef = (index, el) => {
    if (el) {
      sectionRefs.current[index] = el;
    }
  };

  return (
    <PageContainer
      title={<div className="gradient-text">印尼语东仔</div>}>
      <div className='MultiFruit'>
        <Row gutter={[16, 16]}>
          {
            stageList.map((pItem, pIndex) => {
              const {id, name, introduce, pic, children} = pItem;
              return (
                <Col key={id} xs={24} sm={24} md={12} lg={12} xl={8}>
                  <Card title={`${pIndex + 1}. ${name}`}>
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
                            renderItem={(sItem, sIndex) => {
                              const {id, name, flag} = sItem;
                              return (
                                <List.Item
                                  style={{ cursor: 'pointer' }}
                                  key={id}
                                  onClick={() => getSectionsListMethod({sItem, sIndex, pItem, pIndex})}>
                                  <Typography.Text>{name}</Typography.Text>
                                  {(!((pIndex === 0 && sIndex === 0)) && flag === 0) ?
                                    <LockFilled style={{ fontSize: '16px', color: '#1677ff' }}/> :
                                    <UnlockOutlined style={{ fontSize: '16px', color: '#ff4d4f' }} />}
                                </List.Item>
                              )
                            }}>
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
                if(type === '1') RenderComponent = QuestionType1;
                if(type === '2') RenderComponent = QuestionType2;
                if(type === '3') RenderComponent = QuestionType3;
                if(type === '4') RenderComponent = QuestionType4;
                return (
                  <Col key={id} xs={24} sm={24} md={12} lg={12} xl={12}>
                    <RenderComponent ref={(el) => saveRef(index, el)} key={id} data={item} />
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
