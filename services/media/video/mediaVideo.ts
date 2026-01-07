import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import { Media } from '@/types';

/** ------------------------------------------ 媒体-视频信息表 操作接口 ------------------------------------------ */
class Api extends BaseApi<Media.MediaVideo, string> {}

export default new Api(GATE_APP.media.video, 'mediaVideo');
