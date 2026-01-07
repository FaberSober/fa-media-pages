import React from 'react';
import { DownloadOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import { AuthDelBtn, BaseBizTable, BaseDrawer, BaseTableUtils, clearForm, FaberTable, FaHref, useDelete, useDeleteByQuery, useExport, useTableQueryParams } from '@fa/ui';
import { mediaVideoApi as api } from '@/services';
import { Media } from '@/types';
import MediaVideoModal from './modal/MediaVideoModal';
import MediaVideoView from './cube/MediaVideoView';

const serviceName = '媒体-视频信息表';
const biz = 'media_video';

/**
 * 媒体-视频信息表表格查询
 */
export default function MediaVideoList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, paginationProps } =
          useTableQueryParams<Media.MediaVideo>(api.page, {}, serviceName)

  const [handleDelete] = useDelete<string>(api.remove, fetchPageList, serviceName)
  const [exporting, fetchExportExcel] = useExport(api.exportExcel, queryParams)
  const [_, deleteByQuery] = useDeleteByQuery(api.removeByQuery, queryParams, fetchPageList);

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genIndexColumn(paginationProps),
      BaseTableUtils.genIdColumn('视频记录唯一ID', 'id', 70, sorter, false),
      // BaseTableUtils.genSimpleSorterColumn('关联业务ID（如文章ID、动态ID、课程ID等）', 'businessId', 100, sorter),
      // BaseTableUtils.genSimpleSorterColumn('业务类型（如 post、moment、course 等）', 'businessType', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('原视频', 'originFileId', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('文件名', 'originFilename', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('宽度', 'originWidth', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('高度', 'originHeight', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('码率', 'originBitrate', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('时长', 'originDuration', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('原大小', 'originSizeMb', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('720p文件', 'trans720pFileId', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('720p大小', 'trans720pSizeMb', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('封面图文件', 'coverFileId', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('预览视频文件', 'previewFileId', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('预览视频时长', 'previewDuration', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('视频容器格式', 'format', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('视频编码', 'codecVideo', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('音频编码', 'codecAudio', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('帧率', 'fps', 100, sorter),
      // BaseTableUtils.genSimpleSorterColumn('视频状态：0=转码中,1=正常,-1=转码失败,-2=违规', 'status', 100, sorter),
      // BaseTableUtils.genSimpleSorterColumn('审核状态：0=待审核,1=通过,2=拒绝', 'auditStatus', 100, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'menu',
        render: (_, r) => (
          <Space>
            <BaseDrawer triggerDom={<FaHref text="查看" icon={<EyeOutlined />} />}>
              <MediaVideoView item={r} />
            </BaseDrawer>
            <MediaVideoModal editBtn title={`编辑${serviceName}信息`} record={r} fetchFinish={fetchPageList} />
            <AuthDelBtn handleDelete={() => handleDelete(r.id)} />
          </Space>
        ),
        width: 170,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Media.MediaVideo>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-bg-white">
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', padding: 8 }}>
        <div className="fa-h3">{serviceName}</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="originFilename" label="文件名">
              <Input placeholder="请输入文件名" allowClear />
            </Form.Item>

            <Space>
              <Button htmlType="submit" loading={loading} icon={<SearchOutlined />}>查询</Button>
              <Button onClick={() => clearForm(form)}>重置</Button>
              <MediaVideoModal addBtn title={`新增${serviceName}信息`} fetchFinish={fetchPageList} />
              <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>导出</Button>
            </Space>
          </Form>
        </div>
      </div>

      <BaseBizTable
        rowKey="id"
        biz={biz}
        columns={genColumns()}
        pagination={paginationProps}
        loading={loading}
        dataSource={list}
        onChange={handleTableChange}
        refreshList={() => fetchPageList()}
        batchDelete={(ids) => api.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
        showDeleteByQuery
        onDeleteByQuery={deleteByQuery}
      />
    </div>
  );
}
