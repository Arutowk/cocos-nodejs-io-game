import {
  _decorator,
  Component,
  Node,
  input,
  EventTouch,
  Input,
  Vec2,
  UITransform,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("JoyStickManager")
export class JoyStickManager extends Component {
  input: Vec2 = Vec2.ZERO;

  private body: Node;
  private stick: Node;
  private defaultPos: Vec2;
  private radius: number;

  onLoad() {
    //getChildByName从直接子节点查找某子节点
    this.body = this.node.getChildByName("Body");
    this.stick = this.body.getChildByName("Stick");
    this.defaultPos = new Vec2(this.body.position.x, this.body.position.y);
    this.radius = this.body.getComponent(UITransform).contentSize.x / 2;
    input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
  }

  onDestroy() {
    input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
  }

  onTouchStart(event: EventTouch) {
    const touchPos = event.getUILocation();
    this.body.setPosition(touchPos.x, touchPos.y);
  }

  onTouchEnd() {
    this.body.setPosition(this.defaultPos.x, this.defaultPos.y);
    //摇杆回到初始位置
    this.stick.setPosition(0, 0);
    this.input = Vec2.ZERO;
  }

  onTouchMove(event: EventTouch) {
    const touchPos = event.getUILocation();
    //得到相对坐标，需要绝对坐标减去父节点坐标
    const stickPos = new Vec2(
      touchPos.x - this.body.position.x,
      touchPos.y - this.body.position.y
    );
    //超出操作杆范围的话，限制在半径范围内
    if (stickPos.length() > this.radius) {
      stickPos.multiplyScalar(this.radius / stickPos.length());
    }
    this.stick.setPosition(stickPos.x, stickPos.y);

    //归一化会改变原向量，所以要克隆
    this.input = stickPos.clone().normalize();
  }
}
