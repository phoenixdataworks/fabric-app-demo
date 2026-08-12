import { authenticated, date, entity, text, uuid } from '@microsoft/rayfin-core';

@entity()
@authenticated('*', {
  policy: (claims, item) => claims.sub.eq(item.user_id),
})
export class UserAssetEvent {
  @uuid() id!: string;
  @text() user_id!: string;
  @uuid() analytics_asset_id!: string;
  @date() viewedAt!: Date;
}
