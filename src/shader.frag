precision mediump float;

// 这是用于uSampler的局部坐标, [0->1]
// texture2D(uSampler, vTextureCoord)可读出vTextureCoord对应的color
varying vec2 vTextureCoord;

// uSampler是从底图创建的texture, 比如画一个圆, 那么uSampler就是一个圆的png图片，带透明
uniform sampler2D uSampler;
// uTileSampler是需要填充的texture
uniform sampler2D uTileSampler;
uniform vec2 uTileSize;

void main(void)
{
   vec4 bg_Color = texture2D(uSampler, vTextureCoord);
   if (bg_Color.a == 0.0) {
      // 假设原图是Graphics.circle, 则这一部分是圆外多余的部分
      // 原因: circle的filtrArea是矩形!
      discard;
   } else if (abs(bg_Color.a - 0.8) <= 0.00001) {
      // 0.8 == 0xCC, 表示背景
      // 也就是说: 如果你画一个圆, 并将圆的背景alpha设为0.8
      // 那么这个0.8部分会被这里直接替换掉
      vec2 coord = mod(gl_FragCoord.xy, uTileSize) / uTileSize;
      // gl_FragColor = texture2D(uTileSampler, v);
      gl_FragColor = texture2D(uTileSampler, coord);
   } else {
      // 这一部分是框线
      // 框线的alpha不能为0.8!
      gl_FragColor = texture2D(uSampler, vTextureCoord);
   }
}
