import { Button, Input, Select } from 'antd';
import Form, { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { accounts } from '../../accounts';
import { skNodesMachine } from '../../index.state';
import { TRANS_AMOUNT, TRANS_TO } from './config';
import './index.scss';
import { useMachine } from '@xstate/react';

export default function Transaction() {
  const [current] = useMachine(skNodesMachine);
  const [form] = useForm();
  return (
    <div className="trans-box">
      <h3>Trasnaction</h3>
      <Form form={form}>
        <FormItem label="to" name={TRANS_TO}>
          <Select>
            {accounts.map((ele) => {
              return (
                <Select.Option key={ele.id} value={ele.id}>
                  {ele.id}
                </Select.Option>
              );
            })}
          </Select>
        </FormItem>
        <FormItem label="amount" name={TRANS_AMOUNT}>
          <Input type="number" />
        </FormItem>
        <Button
          onClick={() => {
            form.validateFields();
            current.context.chain.sk.transaction({
              amount: form.getFieldValue(TRANS_AMOUNT),
              recipient: form.getFieldValue(TRANS_TO),
              payload: ''
            });
          }}
        >
          trans
        </Button>
      </Form>
    </div>
  );
}
