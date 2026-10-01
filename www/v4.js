(() => {
  const icons = {
    "◈": "🌱",
    "♧": "🌴",
    "❧": "🌿",
    "▦": "🏫",
    "⌁": "💧",
    "◇": "🤝",
    "↗": "📅",
    "≋": "💰",
    "♡": "🏆"
  };

  function applyV4() {
    document.body?.classList.add("ghars-v4");

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );

    let node;

    while ((node = walker.nextNode())) {
      const value = node.nodeValue.trim();

      if (icons[value]) {
        node.nodeValue =
          node.nodeValue.replace(value, icons[value]);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyV4);
  } else {
    applyV4();
  }

  new MutationObserver(applyV4).observe(
    document.documentElement,
    {
      childList: true,
      subtree: true
    }
  );
})();
