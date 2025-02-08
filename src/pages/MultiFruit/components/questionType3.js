import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, Tag, Image, Button, Space, message, Alert, Row, Col, Avatar } from 'antd';
import { RedoOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { CheckCard } from '@ant-design/pro-components';

const QuestionType3 = forwardRef((props, ref) => {
  const { id, title, analysis, type, url, questionOptions } = props.data;
  const [loading, setLoading] = useState(false);

  //音频播放
  const audio = new Audio();
  const once = function () {
    audio.removeEventListener('error', once);
    setLoading(false)
    message.warning('录音地址异常');
  }
  const handlePlayAudio = () => {
    setLoading(true)
    audio.src = url;
    audio.addEventListener('error', once);
    audio.addEventListener('canplaythrough', () => { audio.playbackRate = 1; audio.play() })
    audio.addEventListener('ended', () => { setLoading(false)});
    audio.load()
  }

  //判断是否正确
  const [isCorrect, setIsCorrect] = useState(undefined);
  const judgeResult = () => {
    return isCorrect;
  }

  // 将方法绑定到 ref 上
  useImperativeHandle(ref, () => ({ judgeResult }));

  return (
    <Card
      extra={
        <Space>
          <Button
            loading={loading}
            size="small"
            onClick={() => { handlePlayAudio()}}
            icon={<PlayCircleOutlined />}>
            播放
          </Button>
        </Space>
      }
      title={
        <Space>
          <span>请你选择正确图片</span>
          {
            typeof isCorrect === 'boolean' && (
              isCorrect ? <Tag color="#f50">正确</Tag> : <Tag color="#2db7f5">错误</Tag>
            )
          }
        </Space>
      }
      size="small">
      <Alert message={title} type="success" style={{ marginBottom: 16 }} />
      <CheckCard.Group
        onChange={(id) => {
          const item = questionOptions.find(option => option.id === id);
          const { correct } = item;
          setIsCorrect(correct === "1")
        }}
      >
        <Row gutter={16}>
          {
            questionOptions.map(({ id, content, correct, url }, index) => (
              <Col span={12} key={id}>
                <CheckCard
                  style={{ width: '100%' }}
                  title={content}
                  value={id}
                  avatar={
                    <Avatar
                      src={url}
                      size={80}
                    />
                  }
                />
              </Col>
            ))
          }
        </Row>
      </CheckCard.Group>
    </Card>
  )
})

export default QuestionType3;
