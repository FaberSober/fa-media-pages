import React, { useState } from 'react';
import { get } from 'lodash';
import { Button, Form, Input } from 'antd';
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useApiLoading, DragModal, FaHref, FaUtils, CommonModalProps, UploadFileQiniu } from '@fa/ui';
import { mediaVideoApi as api } from '@/services';
import { Media } from '@/types';


/**
 * 媒体-视频信息表实体新增、编辑弹框
 */
export default function MediaVideoModal({ children, title, record, fetchFinish, addBtn, editBtn, ...props }: CommonModalProps<Media.MediaVideo>) {
  const loading = useApiLoading([ api.getUrl('save'), api.getUrl('update')]);
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    api.save(params).then((res) => {
      FaUtils.showResponse(res, '新增媒体-视频信息表');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    })
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    api.update(params.id, params).then((res) => {
      FaUtils.showResponse(res, '更新媒体-视频信息表');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    })
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      // birthday: FaUtils.getDateStr000(fieldsValue.birthday),
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  function getInitialValues() {
    return {
      businessId: get(record, 'businessId'),
      businessType: get(record, 'businessType'),
      originFileId: get(record, 'originFileId'),
      originFilename: get(record, 'originFilename'),
      originWidth: get(record, 'originWidth'),
      originHeight: get(record, 'originHeight'),
      originBitrate: get(record, 'originBitrate'),
      originDuration: get(record, 'originDuration'),
      originSizeMb: get(record, 'originSizeMb'),
      trans720pFileId: get(record, 'trans720pFileId'),
      trans720pSizeMb: get(record, 'trans720pSizeMb'),
      coverFileId: get(record, 'coverFileId'),
      previewFileId: get(record, 'previewFileId'),
      previewDuration: get(record, 'previewDuration'),
      format: get(record, 'format'),
      codecVideo: get(record, 'codecVideo'),
      codecAudio: get(record, 'codecAudio'),
      fps: get(record, 'fps'),
      status: get(record, 'status'),
      auditStatus: get(record, 'auditStatus'),
      // birthday: FaUtils.getInitialKeyTimeValue(record, 'birthday'),
    }
  }

  function showModal() {
    setOpen(true)
    form.setFieldsValue(getInitialValues())
  }

  return (
    <span>
      <span onClick={showModal}>
        {children}
        {addBtn && <Button icon={<PlusOutlined />} type="primary">新增</Button>}
        {editBtn && <FaHref icon={<EditOutlined />} text="编辑" />}
      </span>
      <DragModal
        title={title}
        open={open}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        width={800}
        {...props}
      >
        <Form form={form} onFinish={onFinish} className='fa-grid2 fa-mt12' {...FaUtils.formItemHalfLayout}>
          <Form.Item name="originFileId" label="视频上传" rules={[{ required: true }]} style={{ gridColumn: 'span 2' }} {...FaUtils.formItemFullLayout}>
            <UploadFileQiniu prefix="media" />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  )
}
