import React, { useState, useEffect, useRef, useCallback  } from 'react';
import { useNavigate, useModel } from 'umi';
import { Alert, Flex, message, Image, Col, Row, Card, List, Typography, Button, Form, Input, Radio } from 'antd';
import { LockFilled, UnlockOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import Texty from 'rc-texty';
import 'rc-texty/assets/index.css';
import service from '../../services';
import {setCookie, getCookie, clearCookie} from '@/utils/rememberPassword';
import "./index.less";
import { getUserInfo } from '@/services/MultiFruitApi';

const Login = () => {
  let navigate = useNavigate();
  //获取cookie中的账号、密码、是否记住密码
  const {username = "", tempPassword = "", isRemember = false} = getCookie();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm()

  const { initialState, setInitialState } = useModel("@@initialState");
  const onFinish = async () => {
    setLoading(true)
    const values = form.getFieldsValue();
    const { code, msg, token } = await service.MultiFruitApi.login(values);
    setLoading(false);
    if(code === 200) {
      localStorage.setItem("token", token);
      //记住密码控制逻辑
      const { username, password, autoLogin } = values;
      if(autoLogin === '1') {
        setCookie(username, password, 7)
      }else {
        clearCookie()
      }
      //获取用户信息
      const userInfo = await service.MultiFruitApi.getUserInfo();
      const { userName } = userInfo;
      setInitialState(state => ({ ...state, name: userName }));
      //跳转
      message.success('登录成功');
      navigate("/MultiFruit", { replace: true });
    }else {
      if(msg === "用户不存在/密码错误") message.error('用户名或密码错误');
      if(msg === "密码输入错误5次，帐户锁定10分钟") message.error('密码输入错误5次，帐户锁定10分钟');
    }
  }

  return (
    <PageContainer title={<Texty>请输入东东通行证</Texty>}>
      <div className="Login">
        <Alert
          style={{ marginBottom: '20px' }}
          message="登录遇到问题？请在工作时间（早上10点-晚上6点）联系对接老师或抖音搜索东东印尼语。"
          type="success"
        />
        <Form
          layout='vertical'
          form={form}
          initialValues={{
            username: username,
            password: tempPassword,
            autoLogin: isRemember ? "1" : '0',
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name='username'
            label='用户名 / ID：'
            rules={[{required: true, message: '用户名不能为空'}]}>
            <Input placeholder='请输入用户名'/>
          </Form.Item>
          <Form.Item
            name='password'
            label='密码 / Kadi：'
            rules={[{required: true, message: '密码不能为空'}]}>
            <Input placeholder='请输入密码'/>
          </Form.Item>
          <Form.Item
            name='autoLogin'
            label='记住密码：'>
            <Radio.Group>
              <Radio value='1'>是</Radio>
              <Radio value='0'>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button
              className='loginBtn'
              block
              type="primary"
              htmlType="submit"
              loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </PageContainer>
  )
}

export default Login;
