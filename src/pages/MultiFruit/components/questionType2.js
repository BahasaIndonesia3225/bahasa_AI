import React, { useState, useEffect } from 'react';
import { useNavigate } from 'umi';
import { Card, Tag, Divider, Button } from 'antd';
import { RedoOutlined } from '@ant-design/icons';

export default () => {
  return (
    <Card
      extra={<Button size="small">重做</Button>}
      title="请你翻译这段话"
      size="small">

    </Card>
  )
};
