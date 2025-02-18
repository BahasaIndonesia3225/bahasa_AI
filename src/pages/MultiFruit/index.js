import React, { useState, useEffect, useRef, useCallback  } from 'react';
import { useNavigate } from 'umi';
import { Spin, Flex, message, Image, Col, Row, Card, List, Typography, Modal, Button, Popconfirm, Space, Empty } from 'antd';
import { LockFilled, UnlockOutlined, RedoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import service from '../../services';
import QuestionType1 from './components/questionType1';
import QuestionType2 from './components/questionType2';
import QuestionType3 from './components/questionType3';
import QuestionType4 from './components/questionType4';
import "./index.less";

const { Title, Paragraph, Text, Link } = Typography;

const MultiFruit = () => {
  //保存关卡的参数
  const [submitParams, setSubmitParams] = useState({stage: undefined, node: undefined});
  //获取阶段列表
  useEffect(() => { getStageListMethod() }, [])
  const [stageList, setStageList] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const getStageListMethod = async () => {
    try {
      setLoading(true)
      const params = { pageNum: 1, pageSize: 100 }
      const { rows, total } = await service.MultiFruitApi.getStageList(params);
      setStageList(rows);
      //获取保存进度的参数
      const pItem = rows.find(item => item?.flag === 0);
      if(pItem) {
        //返回第一条未完成的阶段
        const index = pItem.children.findIndex(item => item?.flag === 0);
        const aItem = pItem.children[index];
        const submitParams = {stage: pItem.stage, node: aItem.stage};
        setSubmitParams(submitParams)
      }else {
        //阶段全部通过
        setSubmitParams({stage: undefined, node: undefined})
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      message.error('获取阶段列表失败，请稍后再试');
    }
  }
  //获取章节题目
  const [needSaveProgress, setNeedSaveProgress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectionsList, setSectionsList] = useState([]);
  const showModal = () => { setIsModalOpen(true);};
  const getSectionsListMethod = async ({sItem, sIndex, pItem, pIndex}) => {
    const {id, flag} = sItem;
    if(flag === 0) {
      return message.warning('请先完成前面的关卡');
    }
    try {
      const { data = [] } = await service.MultiFruitApi.getSectionsList({category: id});
      setSectionsList(data)
      showModal()
      //判断提交时是否需要保存进度
      let needSave;
      if(sIndex <= 3) {
        const { flag } = pItem.children[sIndex + 1];
        needSave = flag === 0;
      }else {
        const item = stageList[pIndex + 1];
        if(item) {
          const { flag } = stageList[pIndex + 1].children[0];
          needSave = flag === 0;
        }else {
          needSave = false;
        }
      }
      setNeedSaveProgress(needSave)
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
    //提交成功
    setIsModalOpen(false);
    message.success('提交成功');
    //更新游戏进度
    if(needSaveProgress) {
      await service.MultiFruitApi.updateProgress(submitParams);
      getStageListMethod();  //刷新页面
    }
  };
  //重置进度
  const handleReset = async () => {
    const stage = stageList[0].stage;
    const node = stageList[0].children[0].stage;
    await service.MultiFruitApi.updateProgress({stage, node});
    message.success('重置进度成功');
    getStageListMethod();
  }
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
      title={<div className="gradient-text">印尼语东仔</div>}
      extra={[
        <Popconfirm
          title="确认重置进度？"
          description="重置进度后将从第一阶段开始玩?"
          onConfirm={() => handleReset()}
          okText="确定"
          cancelText="取消"
        >
          <Button icon={<RedoOutlined />}>
            重置进度
          </Button>
        </Popconfirm>
      ]}>
      <Spin fullscreen={false} spinning={loading}>
        <div className='multi-fruit'>
          <Row gutter={[16, 16]}>
            {
              stageList.map((pItem, pIndex) => {
                const {id, name, introduce, pic, children} = pItem;
                return (
                  <Col key={id} xs={24} sm={24} md={12} lg={12} xl={8}>
                    <Card
                      size="small"
                      className="my-card"
                      title={
                        <Flex justify="space-between"  align="center">
                          <Space direction="vertical" size={0}>
                            <Title style={{ marginBottom: 0 }} level={4}>{name}</Title>
                            <Text style={{ marginBottom: 0 }} type="secondary">{introduce}</Text>
                          </Space>
                          <Image
                            fallback="data:image/png;base64,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"
                            width={60}
                            height={60}
                            src={pic}
                            preview={true} />
                        </Flex>
                      }
                    >
                      {children && !!children.length ? (
                        <List
                          style={{ flex: 1 }}
                          bordered={false}
                          size="small"
                          dataSource={children}
                          renderItem={(sItem, sIndex) => {
                            const { id, name, flag } = sItem;
                            return (
                              <List.Item
                                style={{ cursor: 'pointer' }}
                                key={id}
                                onClick={() =>
                                  getSectionsListMethod({
                                    sItem,
                                    sIndex,
                                    pItem,
                                    pIndex,
                                  })
                                }
                              >
                                <Typography.Text>{name}</Typography.Text>
                                {
                                  flag === 0 ? (
                                    <LockFilled
                                      style={{
                                        fontSize: '16px',
                                        color: '#1677ff',
                                      }}
                                    />
                                  ) : (
                                    <UnlockOutlined
                                      style={{
                                        fontSize: '16px',
                                        color: '#ff4d4f',
                                      }}
                                    />
                                  )
                                }
                              </List.Item>
                            );
                          }}
                        ></List>
                      ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      )}
                    </Card>
                  </Col>
                );
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
      </Spin>
    </PageContainer>
  )
}

export default MultiFruit;
