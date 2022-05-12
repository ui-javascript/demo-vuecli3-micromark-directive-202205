import { renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";

export const emojiUrls = {
  xiong:
    "https://luo0412.oss-cn-hangzhou.aliyuncs.com/static/images/index/xiong.gif",
  cat:
    "https://luo0412.oss-cn-hangzhou.aliyuncs.com/1652243827370-DjxeEK7YYXXp.jpeg",
  dog:
    "https://luo0412.oss-cn-hangzhou.aliyuncs.com/1652249579841-Yty6cpQs34pj.jpeg",
  cool:
    "https://luo0412.oss-cn-hangzhou.aliyuncs.com/1652249708936-SYHxj43D8Ahf.jpeg",
  ichange:
    "https://luo0412.oss-cn-hangzhou.aliyuncs.com/1652249747826-TWzsbJWnaWZD.jpeg",
  tiger:
    "https://luo0412.oss-cn-hangzhou.aliyuncs.com/1652249821637-cT4N4NAhHzcX.jpeg",
};

export default {
  namespace: "img",
  render: (node, ancestors) => {
    const latestAncestors = ancestors[ancestors.length - 1];

    let isEmoji = false;
    for (let key in emojiUrls) {
      if (key in node.attributes) {
        isEmoji = true;
        break;
      }
    }

    const hasArg = node.args && node.args.length > 0;
    const hasUrlAttr = "url" in node.attributes || "src" in node.attributes;
    const hasEnoughChildren =
      latestAncestors.children && latestAncestors.children.length > 1;

    if (!isEmoji && !hasUrlAttr && !hasArg && !hasEnoughChildren) {
      renderVoidElement(node);
      return;
    }

    if (hasUrlAttr) {
      const data = node.data || (node.data = {});
      const hast = h("img", {
        ...node.attributes,
        src: node.attributes.url || node.attributes.src,
      });

      data.hName = hast.tagName;
      data.hProperties = hast.properties;
      data.hChildren = hast.children;

      return;
    }

    if (hasArg) {
      const data = node.data || (node.data = {});
      const hast = h("img", {
        ...node.attributes,
        src: node.args[0],
      });

      data.hName = hast.tagName;
      data.hProperties = hast.properties;
      data.hChildren = hast.children;

      return;
    }

    // @todo 冗余代码
    if (isEmoji) {
      const data = node.data || (node.data = {});

      let src;
      for (let key in node.attributes) {
        if (key !== "src" && key != "style" && key != "class" && key != "id") {
          // 暂时只排除这四个字段
          src = emojiUrls[key];
          break;
        }
      }

      if (!src) {
        renderVoidElement(node);
        return;
      }

      const hast = h("img", {
        ...node.attributes,
        src,
      });

      data.hName = hast.tagName;
      data.hProperties = hast.properties;
      data.hChildren = hast.children;

      return;
    }

    let nextNode = null;
    for (let idx in latestAncestors.children) {
      // console.log("节点" + idx)
      // console.log(item)
      const item = latestAncestors.children[idx];
      idx = parseInt(idx);

      if (
        item.type === "textDirective" &&
        item.name === node.name // @todo 准确定位标签
      ) {
        let nextIdx = idx;

        while (++nextIdx < latestAncestors.children.length) {
          const tempNode = latestAncestors.children[nextIdx];

          if (tempNode && tempNode.type === "text" && trim(tempNode.value)) {
            nextNode = tempNode;
            break;
          }
        }

        if (nextNode) {
          console.log("修改后节点");
          console.log(nextNode);

          const data = nextNode.data || (nextNode.data = {});
          const hast = h("img", {
            ...node.attributes,
            src: nextNode.value,
          });

          data.hName = hast.tagName;
          data.hProperties = hast.properties;
          data.hChildren = hast.children;
        }

        break;
      }
    }

    // 无论是否找到nextNode, 当前节点都得渲染成空节点
    renderVoidElement(node);
  },
};
