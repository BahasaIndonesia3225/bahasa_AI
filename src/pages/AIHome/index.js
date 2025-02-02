import React, { useState } from 'react';
import { useNavigate } from 'umi';
import { Avatar, Flex, Divider, Button  } from 'antd';
import { Prompts, Sender } from '@ant-design/x';
import { BulbOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import "./index.less";

//设置提示
import { PromptData } from './promptsData.js';
const randomNum = 6;
const PromptData_ = PromptData.sort(() => Math.random() - 0.5).slice(0, randomNum);
const items = PromptData_.map((txt, index) => {
  return {
    key: index,
    icon: <BulbOutlined style={{ color: '#FFD700' }} />,
    description: txt,
  }
})

const AIHome = () => {
  const [value, setValue] = useState("");

  //跳转对话页面
  let navigate = useNavigate();
  const handleSubmit = () => {
    navigate("/AIDialogue", {
      replace: false,
      state: { "value": value }
    });
  }
  const handleClickPrompt = (value) => {
    navigate("/AIDialogue", {
      replace: false,
      state: { value }
    });
  }

  //友情链接
  const dumpLink = (type) => {
    const link = type === "youtube" ? "https://www.youtube.com/channel/UCNz0CuIKBXpizEmn8akC42w" : "https://v.douyin.com/iNNrghAv/ 8@5.com";
    window.open(link, "_blank")
  }

  return (
    <PageContainer
      title={<div className="gradient-text">欢迎使用小曼同学</div>}>
      <div className='AIHome'>
        <Flex gap={24} vertical align="center">
          <Avatar
            size={{xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100}}
            src={"https://taioassets.oss-cn-beijing.aliyuncs.com/Pics/DongMultiFruit/aiLogo.png"}
          />
          <p>👋你好呀，我是小曼同学，有问题随时欢迎问我。</p>
          <Divider plain>试试这些问题</Divider>
          <Prompts
            items={items}
            wrap
            onItemClick={(info) => handleClickPrompt(info.data.description)}
          />
          <Sender
            value={value}
            onChange={(v) => {
              setValue(v);
            }}
            onSubmit={() => handleSubmit()}
          />
        </Flex>
        <div className="bahasaindoFooter">
          <div className="friendLink">
            <span onClick={() => dumpLink('youtube')}>东东印尼语YouTube</span>
            <span onClick={() => dumpLink('tiktok')}>东东印尼语抖音</span>
          </div>
          <p>
            D 2019-2024 PT BahasaDona All rights reserved
          </p>
        </div>
      </div>
    </PageContainer>
  )
}

export default AIHome;
