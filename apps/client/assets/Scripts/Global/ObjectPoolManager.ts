import { _decorator, Node, instantiate } from "cc";
import Singleton from "../Base/Singleton";
import { EntityTypeEnum } from "../Common";
import DataManager from "./DataManager";

//复用已经产生出来的对象，而不会一直实例化和销毁
export class ObjectPoolManager extends Singleton {
  static get Instance() {
    return super.GetInstance<ObjectPoolManager>();
  }

  private objectPool: Node;
  private map: Map<EntityTypeEnum, Node[]> = new Map();

  get(type: EntityTypeEnum) {
    if (!this.objectPool) {
      this.objectPool = new Node("ObjectPool");
      this.objectPool.setParent(DataManager.Instance.stage);
    }
    if (!this.map.has(type)) {
      this.map.set(type, []);
      const container = new Node(type + "Pool");
      container.setParent(this.objectPool);
    }
    const nodes = this.map.get(type);
    //没有相关对象的时候实例一个
    if (!nodes.length) {
      const prefab = DataManager.Instance.prefabMap.get(type);
      const node = instantiate(prefab);
      node.name = type;
      node.setParent(this.objectPool.getChildByName(type + "Pool"));
      node.active = true;
      return node;
    } else {
      //使用一个销毁的节点
      const node = nodes.pop();
      node.active = true;
      return node;
    }
  }

  //对象销毁的时候才归还，所以短时间产生大量对象还是会不停实例
  ret(node: Node) {
    node.active = false;
    this.map.get(node.name as EntityTypeEnum).push(node);
  }
}
