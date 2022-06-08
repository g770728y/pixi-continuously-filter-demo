import './style.css'
import { Application, Filter, Graphics, LineStyle, Loader, LoaderResource, Matrix, Sprite, Transform } from 'pixi.js';

declare type Dict<T> = {
  [key: string]: T;
};

const dom = document.querySelector<HTMLDivElement>('#app')!
const app = new Application({ width: 640, height: 500, backgroundColor: 0xffffff, antialias: true });
dom.appendChild(app.view);

// const p = new Graphics().beginFill(0x0000ffff).drawCircle(200, 200, 100).endFill();
const arr = new Array(1000).fill(1);
const ps = arr.map((color, idx) => {
  console.log(1);
  const p = new Graphics();
  // 这行是关键, 将alpha设为0.8后, shader.uSampler中凡是alpha为0.8的部分, 就是filter需要生效的部分
  p.beginFill(0xffff00, 0.8);
  p.lineStyle(0, 0x00ff00, 1.0);
  p.drawCircle(200*(idx+1)*0.01, 200, 100);
  // p.drawCircle(200, 200, 100);
  p.endFill();
  app.stage.addChild(p);
  return p;
});

const t = new Transform();
const m = Matrix.IDENTITY.translate(200,200).scale(0.5, 0.5);
t.setFromMatrix(m);
app.stage.transform = t;

app.stop();

// app.loader.add('jpg', "http://localhost:8080/src/grass.jpg");
app.loader.add('jpg', "http://localhost:8080/src/window.png");
app.loader.add('shader', "http://localhost:8080/src/shader.frag");
app.loader.load(onLoaded);

let filter: Filter;

function onLoaded(_: Loader, res: Dict<LoaderResource>) {
  filter = new Filter(undefined, res.shader.data, {
    uTileSampler: res.jpg.texture,
    uTileSize: [res.jpg.data.width, res.jpg.data.height]
  });
  ps.forEach(p => {
    p.filters = [filter];
  });

  app.start();
}
setInterval(()=>{
  console.log(app.ticker.FPS);
}, 1000)

// 三种手段优化，最终一个都没用上（filter数量是有限的，每个filter对应1个texture, 所以最多50个filter50个texture, 不用再优化了)
// https://stackoverflow.com/questions/40722796/is-it-possible-to-create-a-pixi-texture-from-multiple-image-sources-in-pixi-js
// spritesheet
// webgl实现