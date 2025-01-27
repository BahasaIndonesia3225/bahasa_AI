import React, { useState } from 'react';
import { Avatar, Space, Button, Statistic, Alert  } from 'antd'
import { UserOutlined, RedoOutlined, CopyOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { useXAgent, useXChat, Sender, Bubble, XRequest, Welcome  } from '@ant-design/x';
import { PageContainer } from '@ant-design/pro-components';
import { TYPrompt } from '@/utils/format';
import markdownit from 'markdown-it';
import copy from "copy-to-clipboard";
import "./index.less"

//markdown语法转换为html
const md = markdownit({ html: true, breaks: true });
const renderMarkdown = (content) => (
  <div dangerouslySetInnerHTML={{__html: md.render(content)}}/>
)

//通义千问
const {create} = XRequest({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
  dangerouslyApiKey: 'sk-ab3033f199eb4bcd93ea82f4c76cd117',
  model: 'qwen-plus',
});

//ai头像
const AvatarUrl = "https://taioassets.oss-cn-beijing.aliyuncs.com/Pics/DongMultiFruit/aiLogo.png"

const aiDialogue = () => {
  const listRef = React.useRef(null);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  //复制
  const handleCopyAnswer = () => {
    copy(333);
  }

  //重新生成
  const handleRepeatAnswer = () => {}

  const roles = {
    ai: {
      placement: 'start',
      avatar: { icon: <Avatar src={AvatarUrl} /> },
      typing: { step: 5, interval: 20 },
      className: "aiBubble",
      style: {
        maxWidth: '85%',
      },
      messageRender: renderMarkdown,
      header: '小曼同学',
      footer: (
        <Space style={{ '--gap': '0' }}>
          <Button
            disabled={loading}
            size='small'
            icon={<RedoOutlined />}
            onClick={() => { handleRepeatAnswer()}}>
            重新生成
          </Button>
          <Button
            disabled={loading}
            size='small'
            icon={<CopyOutlined />}
            onClick={() => { handleCopyAnswer()}}>
            复制
          </Button>
        </Space>
      )
    },
    user: {
      placement: 'end',
      className: "userBubble",
    },
  }

  //通话滚动顶部
  const handleScrollBubble = () => {
    listRef.current?.scrollTo({
      key: 0,
      block: 'nearest',
    });
  }

  const [agent] = useXAgent({
    request: async (info, callbacks) => {
      const { messages, message } = info;
      const { onUpdate } = callbacks;
      let content = '';

      try {
        create(
          {
            messages: [{ role: 'user', content: TYPrompt(message) }],
            stream: true,
          },
          {
            onSuccess: (chunks) => {
              setLoading(false);
            },
            onError: (error) => {
              console.log('error', error);
            },
            onUpdate: (chunk) => {
              const { data } = chunk;
              if(data.indexOf('[DONE]') === -1) {
                const message = JSON.parse(data);
                content += message?.choices[0].delta.content;
                onUpdate(content);
              }
            },
          },
        );
      } catch (error) {}
    },
  });

  const { onRequest, messages } = useXChat({ agent });
  const items = messages.map(({ message, id }, i) => {
    const isAI = !!(i % 2);
    return {
      key: i,
      role: isAI ? 'ai' : 'user',
      content: message,
    }
  });

  return (
    <PageContainer ghost>
      <div className='aiDialogue'>
        <Welcome
          style={{
            marginBottom: '12px',
            backgroundImage: 'linear-gradient(97deg, rgba(90,196,255,0.12) 0%, rgba(174,136,255,0.12) 100%)'
          }}
          icon="https://taioassets.oss-cn-beijing.aliyuncs.com/Pics/DongMultiFruit/aiLogo.png"
          title="你好, 我是小曼同学"
          description="服务生成的所有内容均由人工智能模型生成，其生成内容的准确性和完整性无法保证，不代表我们的态度或观点。希望在您学习的道路上，能够提供您最多的帮助~"
        />
        <Bubble.List
          ref={listRef}
          className="myBubbleList"
          autoScroll={true}
          items={items}
          roles={roles}
        />
        <Sender
          value={value}
          onChange={(v) => {
            setValue(v);
          }}
          allowSpeech
          loading={loading}
          onSubmit={() => {
            setValue('');
            setLoading(true);
            onRequest(value)
          }}
        />
      </div>
    </PageContainer>
  );
};

export default aiDialogue;
