export default defineNuxtPlugin(() => {
  const currentUrl = new URL(window.location.href);
  const redirectNetworkKeys = ["auroria"];
  for (const network of redirectNetworkKeys) {
    if (currentUrl.origin === `https://${network}.verium.xertra.com`) {
      const newUrl = new URL(currentUrl.href);
      newUrl.hostname = "verium.xertra.com";
      newUrl.searchParams.set("network", network);
      navigateTo(newUrl.href, {
        external: true,
      });
      break;
    }
  }
});
