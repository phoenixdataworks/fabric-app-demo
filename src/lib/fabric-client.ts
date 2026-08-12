import { SemanticModelMessageClient } from '@microsoft/fabric-app-data-embed-client';
import { FabricClient } from '@microsoft/fabric-app-data';
import { EmbedFabricApiProxy } from '@microsoft/fabric-app-data-proxy';

import { fabricConfig } from '@/fabric.generated';

let _client: FabricClient | undefined;
let _messageClient: SemanticModelMessageClient | undefined;

function getSemanticModels() {
  const models = fabricConfig.semanticModels;
  if (!models || Object.keys(models).length === 0) {
    throw new Error(
      'No semantic models in src/fabric.generated.ts. Run: npm run fabric:generate',
    );
  }
  return models;
}

export function getFabricClient(): FabricClient {
  if (!_messageClient) {
    _messageClient = new SemanticModelMessageClient();
  }

  if (!_client) {
    const proxy = new EmbedFabricApiProxy(_messageClient);
    _client = new FabricClient({
      proxy,
      daxProtocol: 'arrow',
      semanticModels: getSemanticModels(),
    });
  }

  return _client;
}
