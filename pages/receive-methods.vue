<template>
  <div>
    <PageTitle :fallback-route="{ name: 'assets' }">Receive</PageTitle>

    <div class="space-y-4">
      <CommonCardWithLineButtons>
        <DestinationItem
          label="View address"
          :description="`Receive from another ${destinations.era.label} account`"
          as="RouterLink"
          :to="{ name: 'receive' }"
        >
          <template #image>
            <QrCodeIcon class="p-0.5" />
          </template>
        </DestinationItem>
      </CommonCardWithLineButtons>
      <CommonCardWithLineButtons>
        <DestinationItem
          v-if="eraNetwork.l1Network"
          label="Official bridge"
          :description="`Receive from your ${destinations.stratis.label} account`"
          :icon-url="destinations.stratis.iconUrl"
          as="RouterLink"
          :to="{ name: 'bridge', query: $route.query }"
        />
      </CommonCardWithLineButtons>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { QrCodeIcon } from "@heroicons/vue/24/outline";

const { destinations } = storeToRefs(useDestinationsStore());
const { eraNetwork } = storeToRefs(useZkSyncProviderStore());
</script>

<style lang="scss" scoped></style>
