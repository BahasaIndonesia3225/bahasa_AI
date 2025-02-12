import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, Tag, Divider, Button, Space, message, Alert, Flex } from 'antd';
import { RedoOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { fisherYatesShuffle } from "@/utils/format";

const tagStyle = {
  height: 22,
  cursor: 'pointer'
}

const QuestionType2 = forwardRef((props, ref) => {
  const { id, title, analysis, type, url, questionOptions } = props.data;
  const [topWordArray, setTopWordArray] = useState([]);
  const [bottomWordArray, setBottomWordArray] = useState([]);
  const [loading, setLoading] = useState(false);

  //设置词组
  useEffect(() => {
    let wordArray = title.split(' ');
    wordArray = fisherYatesShuffle(wordArray);
    setBottomWordArray(wordArray);
  }, [])

  //单词选择
  const handleSelectWord = (word) => {
    const bottomWordArray_ = bottomWordArray.filter(word_ => word_ !== word);
    setBottomWordArray(bottomWordArray_);
    setTopWordArray([...topWordArray, word]);
  }

  //重置
  const handleResetWord = () => {
    let wordArray = title.split(' ');
    wordArray = fisherYatesShuffle(wordArray);
    setBottomWordArray(wordArray);
    setTopWordArray([])
  }

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
    const isCorrect = topWordArray.join(' ') === title;
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
          <Button
            size="small"
            onClick={() => { handleResetWord()}}
            icon={<RedoOutlined/>}>
            重做
          </Button>
        </Space>
      }
      title={
        <Space>
          <span>请你翻译这段话</span>
          {
            typeof isCorrect === 'boolean' && (
              isCorrect ? <Tag color="#f50">正确</Tag> : <Tag color="#2db7f5">错误</Tag>
            )
          }
        </Space>
      }
      size="small">
      <Alert message={analysis} type="success" style={{ marginBottom: 16 }} />
      <Flex gap="4px 0" wrap>
        { topWordArray.map((word, index) => (
          <Tag
            key={index}
            style={tagStyle}>
            {word}
          </Tag>
        )) }
      </Flex>
      <Divider
        dashed
        style={{ borderColor: '#7cb305', fontSize: 12, color: '#cccccc', margin: '8px 0' }}>
        根据音频，将单词按顺序排列
      </Divider>
      <Flex gap="4px 0" wrap>
        { bottomWordArray.map((word, index) => (
          <Tag
            onClick={() => { handleSelectWord(word)} }
            key={index}
            style={tagStyle} >
            {word}
          </Tag>
        )) }
      </Flex>
    </Card>
  )
})

export default QuestionType2;
