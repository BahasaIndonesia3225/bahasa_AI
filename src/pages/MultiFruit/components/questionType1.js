import React, { useState, useEffect } from 'react';
import { useNavigate } from 'umi';
import { Card, Tag, Divider, Button, Space, message } from 'antd';
import { RedoOutlined, PlayCircleOutlined } from '@ant-design/icons';

const tagStyle = {
  height: 22,
  minWidth: 60,
  cursor: 'pointer'
}

export default (params) => {
  const { id, title, analysis, type, url, questionOptions } = params.data;
  const [topWordArray, setTopWordArray] = useState([]);
  const [bottomWordArray, setBottomWordArray] = useState([]);
  const [loading, setLoading] = useState(false);

  //设置词组
  useEffect(() => {
    let wordArray = title.split(' ');
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
  const [isTrue, setIsTrue] = useState(true);
  const judgeResult = () => {
    const a = topWordArray.join(' ');
    const isTrue = a === title;
    setIsTrue(isTrue);
    return isTrue;
  }

  return (
    <Card
      style={{ backgroundColor: isTrue ? '#fff' : '#f6ffed' }}
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
      title="请输入你听到的内容"
      size="small">
      { topWordArray.map((word, index) => (
        <Tag
          key={index}
          style={tagStyle}>
          {word}
        </Tag>
      )) }
      <Divider
        dashed
        style={{ borderColor: '#7cb305', fontSize: 12, color: '#cccccc', margin: '8px 0' }}>
        根据音频，将单词按顺序排列
      </Divider>
      { bottomWordArray.map((word, index) => (
        <Tag
          onClick={() => { handleSelectWord(word)} }
          key={index}
          style={tagStyle} >
          {word}
        </Tag>
      )) }
    </Card>
  )
};
