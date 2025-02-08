import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, Tag, Image, Button, Space, message, Input } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';

const QuestionType4 = forwardRef((props, ref) => {
  const { title, analysis, url } = props.data;
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

  //单词截取设置
  const[value, setValue] = useState('');
  const [sentence, setSentence] = useState([]);
  const handleSetSentence = () => {
    const sentence = title.split(analysis);
    setSentence(sentence);
  }
  useEffect(() => { handleSetSentence() }, [])

  //判断是否正确
  const [isCorrect, setIsCorrect] = useState(undefined);
  const judgeResult = () => {
    const isCorrect = value === analysis;
    setIsCorrect(isCorrect);
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
          <span>请你写出正确单词</span>
          {
            typeof isCorrect === 'boolean' && (
              isCorrect ? <Tag color="#f50">正确</Tag> : <Tag color="#2db7f5">错误</Tag>
            )
          }
        </Space>
      }
      size="small">
      <Space>
        <span>{sentence[0]}</span>
        <Input
          style={{ width: 80 }}
          placeholder="请输入"
          variant="filled"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <span>{sentence[1]}</span>
      </Space>
    </Card>
  )
})

export default QuestionType4;
