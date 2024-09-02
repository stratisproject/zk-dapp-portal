export default defineNuxtPlugin(() => {
  const currentUrl = new URL(window.location.href);
  const redirectNetworkKeys = ["auroria"];
  for (const network of redirectNetworkKeys) {
    if (currentUrl.origin === `https://${network}.verium.stratisplatform.com`) {
      const newUrl = new URL(currentUrl.href);
      newUrl.hostname = "verium.stratisplatform.com";
      newUrl.searchParams.set("network", network);
      navigateTo(newUrl.href, {
        external: true,
      });
      break;
    }
  }
});
