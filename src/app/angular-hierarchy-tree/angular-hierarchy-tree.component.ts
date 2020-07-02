import { Component, Input, Output, OnInit, AfterViewInit, EventEmitter, ElementRef, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { TreeNode, TreeModel, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions, TreeDraggedElement } from 'angular-tree-component';

import { Observable } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject} from 'rxjs';
import {  takeUntil } from "rxjs/operators";

//  import * as _ from 'lodash';
import { timer, Subscription } from 'rxjs';
import { AppService } from '../app-service/app.service';
let singleClickActive: boolean = false;
let clickedNodeUUID:Number=0; 

const actionMapping: IActionMapping = {
  mouse: {
    contextMenu: (tree, node, $event, thisComp) => {
      $event.preventDefault();
      AngularHierarchyTreeComponent.clientXValue = 0;
      AngularHierarchyTreeComponent.clientYValue = 0;
      if (thisComp.HierarchyTreeName != "AvailableEntities") {
        thisComp.sendDataToCapabilityTreeComponent("NodeOnContextClickBeforeInit", node, $event);
      }
    },
    dblClick: (tree, node, $event, thisComp) => {
      TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event)
    },
    click: (tree, node, $event, thisComp) => {
      singleClickActive = true;
      clickedNodeUUID=node.data.uuid;
      if (node.data.EntityType != "Personal" && node.data.EntityType != "Shared" && node.data.EntityType != "Carousel"&& !(node.data.Parent && node.data.Parent.length > 0 && node.data.Parent[0].EntityId == "Shared")) {

        thisComp.callshiftclick(tree, node, $event);
        if (thisComp.HierarchyTreeName != "AvailableEntities") {
          ($event.shiftKey || $event.ctrlKey)
            ? null
            : thisComp.sendDataToCapabilityTreeComponent("NodeOnClick", node);
        }
      }

    }


  },
  keys: {
    [KEYS.ENTER]: (tree, node, $event) => { }
  }
};

@Component({
  selector: 'app-angular-hierarchy-tree',
  templateUrl: './angular-hierarchy-tree.component.html',
  styleUrls: ['./angular-hierarchy-tree.component.scss']
})
export class AngularHierarchyTreeComponent implements OnInit, AfterViewInit, OnDestroy {

  nodes: any[] = [];
  tree;
  filterFunc: any;
  searchValue = ''
  nodeWidth = '100%';
  contextMenuOption = [];
  tempCallBackFunction;
  expanderClickEventRestrict=true;
  ActiveTreeNode;
  data2;
  from = 0
  to = 0
  previousnodes = [];
  previousid;
  public static clientXValue: any;
  public static clientYValue: any;

  public treeDataLengthIsZero = true;
  @ViewChild('tree', { static: false }) angularTree: any;

 
  locations = [];
  peoples = [];


  customTemplateStringOptions: ITreeOptions = {
    displayField: 'EntityName',
    isExpandedField: 'expanded',
    idField: 'uuid',
    actionMapping,
    nodeHeight: 18,
    allowDrag: true,
    allowDrop: false,
    useVirtualScroll: true,
    animateExpand: true,
    scrollOnActivate: false,
    animateSpeed: 10,
    animateAcceleration: 1.2,
    dropSlotHeight: 2,

  };
  isShiftAndCtrlSelectedNodeAvailable=false;
  takeUntilDestroyObservables=new Subject();
  
  @Input() HierarchyTreeName = 'MyTestingTree';
  @Output() EmmitTreeData: EventEmitter<any> = new EventEmitter<any>();
  // @ViewChild(MatMenuTrigger, { static: false }) trigger: MatMenuTrigger;
  ngUnsubscribe=new Subject();
  constructor(private appService:AppService,private elementRef: ElementRef, private cdRef: ChangeDetectorRef,public router: Router,public route: ActivatedRoute) {
  this.appService.sendMessageToTreeComponent.pipe(this.compUntilDestroyed()).subscribe((res:any)=>{
    if(res){
      switch(res.Type){
        case "ActivateNode":
          let p1 = performance.now();
          this.ActiveSelectedNode(res);
          let p2 = performance.now();
          console.log("Active node time:"+(p2-p1))
          break;
        case "CreateTree":
          this.createTree(res); 
         break;
        default:break;
      }
    }
  })
  }
  createTree(res){
    this.nodes=res.treePayload
    let p1 = performance.now();
    this.cdRef.detectChanges();
    this.cdRef.markForCheck();
    let p2 = performance.now();
    console.log("TreeTIme:"+(p2-p1));
  }

  ngOnInit() {
    try {
      this.customTemplateStringOptions.rootId = this.HierarchyTreeName;
      this.customTemplateStringOptions.useVirtualScroll = true;
    }
    catch (e) {
      console.error(e);
    }
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit =>start-ahtc")
  
  }

  changeDefaultTreeConfig(config: any) {
   
  }


  public setExpandedNodes(expandedNodeIds: any) {
    this.tree.treeModel.expandedNodeIds = expandedNodeIds;
    this.refreshUpdateTree();
  }

  public collapseAll() {
    let expandedNodeIds: any = {};
    this.setExpandedNodes(expandedNodeIds);
  }

  public expandAll() {
    let expandedNodeIds: any = {};
    this.tree.treeModel.update();

    for (let node of this.tree.treeModel.roots) {
      expandedNodeIds = this.updateNode(node, expandedNodeIds, true)
    }

    this.setExpandedNodes(expandedNodeIds);
    console.log(this.tree.treeModel.roots);
    console.log(expandedNodeIds);
    console.log("------------------------------------------------------");
  }
  private updateNode(node: TreeNode, expandedNodeIds: any, expand: boolean) {
    let newExp = expandedNodeIds
    let children = node.children
    if (children) {
      for (let child of children) {
        newExp = this.updateNode(child, newExp, expand);
      }
    }
    if (node.hasChildren) {
      return Object.assign({}, newExp, { [node.id]: expand });
    }
    return newExp;
  }


  displayData() {

  }

  cancle() {
  }

  reinitializeTreeSubscription(treeData$: Observable<any>) {
    if (this.tree$) {
      this.tree$.unsubscribe();
    }

    this.GenerateTree(treeData$);
  }

  tree$: Subscription;

  GenerateTree(data) {
   this.nodes = data;
  }

  async updateTreeNode() {

  }



  expandeORcollapseOnClickForLists(message: any){
  }

  

  addOrUpdateNode(message) {
    try {
      let node = this.getNodeById(message.treePayload.EntityId);
      if (node == undefined) {
        node = this.getNodeByEntityId(message.treePayload.EntityId);
      }
      if (node) {
        message.treePayload.NodeData.children = node.data.children && node.data.children.length > 0 ? node.data.children : [];
        this.updateNodeById(message);
      }
      else {
        this.AddNewNode(message);
      }
    }
    catch (e) {
      console.error(e);
    }
  }

 
  //Delete Node Based On (Parent Node Based)
  deleteNodebasedOnparentEntity(message: any) {    
  }
  TreeFilterByText(message: any) {
  }

  RemoveFilter() {
  }
  TreeFilterByEntityIds(message: any) { 
  }
  printErrorInConsole(data, errorType) {
    console.error(data + "---AngularTree---" + errorType);
  }
  ActiveSelectedNode(message: any) {
    var node;
    //this.collapseAll();
    node = this.getNodeByEntityId(message.treePayload);

    this.ActiveTreeNode = node;
    if (node == undefined) {
    } else {
      var treeNode = this.tree.treeModel.getFocusedNode();
      if (treeNode != null && treeNode && treeNode.isActive) {
        treeNode.toggleActivated();
      }
      node.setActiveAndVisible(true);      
    } 
  }

  AddNewNode(message: any) {    
  }

  AddNewNode_OtherSession(message: any) {
  }

  sortNodesByOrder(listOfChildren: any[], SortingOrder: any[]): any[] {
    try {
      let NewSortedListOfChildren = [];
      SortingOrder.map((item: string) => {
        let SortArray = [];
        listOfChildren.forEach((element: any) => {
          if (element.EntityType == item || element.Type == item)
            SortArray.push(element);
        });

        SortArray.sort((firstEntity, secondEntity) => {
          if (firstEntity['EntityName'] && secondEntity['EntityName'])
            return firstEntity['EntityName'].toLowerCase() > secondEntity['EntityName'].toLowerCase() ? 1 : -1
        });
        NewSortedListOfChildren = [...NewSortedListOfChildren, ...SortArray];
      });
      return NewSortedListOfChildren;
    }
    catch (e) {
      console.error(e);
    }
  }

  sortNodesByName(listOfChildren: any[]): any[] {
    try {
      return listOfChildren.sort((firstEntity, secondEntity) => {
        if (firstEntity['EntityName'] && secondEntity['EntityName'])
          return firstEntity['EntityName'].toLowerCase() > secondEntity['EntityName'].toLowerCase() ? 1 : -1
      });
    }
    catch (e) {
      console.error(e);
    }
  }

  AddFullChildrensForParens(payloadData) {
    try {
      var node = this.getNodeByEntityId(payloadData.InsertAtPosition);
      if (node != null) {
        node.data.children = payloadData.NodeData
        this.refreshUpdateTree();
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  refreshUpdateTree() {
    try {
      if (this.tree && this.tree.treeModel) {
        this.tree.treeModel.update();
      }
      this.cdRef.detectChanges();
    }
    catch (e) {
      console.error(e);
    }
  }

  deleteNodeById(message: any) {
  }

  ReArrange(message: any) {
    try {
      var node = this.getNodeById(message.treePayload.NodeData.Parent[0]["EntityId"]);
      if (node == undefined) {
        node = this.getNodeByEntityId(message.treePayload.NodeData.Parent[0]["EntityId"]);
      }
      if (node) {
        var nodeData = message.treePayload.NodeData;
        node.data.children.push(nodeData);
      }
      this.refreshUpdateTree();
      this.cdRef.detectChanges();
    }

    catch (e) {
      console.error(e);
    }

  }

  updateNodeById(message: any) {  
  }

  moveNodeById(data) {    
  }

  nodeOnDrop(event, node) {
    try {
      this.sendDataToCapabilityTreeComponent("NodeOnDrop", node, event);
    }
    catch (e) {
      console.error(e);
    }
  }

  nodeAllowDrop(element) {
    try {
      return true;
    }
    catch (e) {
      console.error(e);
    }
  }

  getNodeById(idString: string): TreeNode {
    try {
      if (this.tree && this.tree.treeModel && idString) {
        var model: TreeModel = this.tree.treeModel;
        var node: TreeNode = model.getNodeById(idString);
        return node;
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  getNodeByEntityId(idString: string): TreeNode {
    try {
      if (this.tree && this.tree.treeModel && idString) {
        var model: TreeModel = this.tree.treeModel;
        var node: TreeNode = model.getNodeBy((node) => node.data.EntityId == idString);
        return node;
      }
    }
    catch (e) {
      console.error(e);
    }
  }
  getAllNodeByEntityId(idString: string): TreeNode[] {
    try {
      if (this.tree && this.tree.treeModel) {
        var model: TreeModel = this.tree.treeModel;
        var nodes = []
        var node: TreeNode = model.getNodeBy((node) => {
          if (node.data.EntityId == idString) {
            nodes.push(node);
          }
        });
        return nodes;
      }
    }
    catch (e) {
      console.error(e);
    }
  }
  partialCollapse(){
    let expandedNodes=this.tree.treeModel.expandedNodes;
    expandedNodes.forEach(element => {
      element.collapseAll();
    });
  }
  curretFocusedNode(location) {   
  }
  DeActiveSelectedNode(message: any) {    
  }

  toggleExpandedEvent(event: any) {   
  }

  createContextmenue(currentThis) {    
  }



  DeactivateNodeIfOld(id) {   
  }

  getLastTreeChild(id) {
    
  }


  firstlocation;
  nextlocationId;
  lastLocation;
  sendDataToCapabilityTreeComponent(treeOperationType: string, treePayload: any, other?: any) {   

  }
  getFirstChildLocation(dist) {
   
  }
  getLastChildLocation(dist) {
  
  }
  onEvent(event: any) {
    this.cdRef.detectChanges();
  }

  onInitialized(tree: any) {
    try {
      this.tree = tree;
    }
    catch (e) {
      console.error(e);
    }

  }

  contextOptionClick($event) {
  

  }

  Bigdatalazyloading(node: any) {

  }

  getIcon(EveData) {
    try {
      var entityType = EveData.NodeEntityType;
      if (EveData.fullNode.WellType == 'Effluent' && entityType == "GasWell") {
        return 'EffluientGasWellTreeIcon';
      }else if(entityType == 'DowntimeReason'){
        // this condition did not remove because DowntimeReasonTreeIcon is not there
        return;
      }
      else {
        return entityType + "TreeIcon";
      }
    }
    catch (e) {
      console.error(e);
    }
  }


  getColor(d) {
    try {
      let color = "red";
      if (d.formValidate == undefined) {
        color = "transparent"
      }
      else if (d.formValidate) {
        color = 'none';
      }
      else {
        color = "red"
      }
      return color;
    }
    catch (e) {
      console.error(e);
    }
  }

  getAngularTreeEvent(model: any) {
    
  }

  menuClose() { 
  }

  clickOutSideTreeBody() {   
  }

  deActiveShiftCtrlSelectedNode(){
    try{
      let entityId="";
      let routerUrl = this.router.url;
      if (this.tree && this.tree.treeModel) {
        var treeNodes = this.tree.treeModel.getActiveNodes();
        if (treeNodes && treeNodes.length != 0) {
          treeNodes.forEach((node) => {
            if (node && node.isActive) {
              if(routerUrl && node.data && !routerUrl.includes(node.data.EntityId)){
                node.toggleActivated();
                //TREE_ACTIONS.DEACTIVATE(this.tree, node,null);
                //console.log("routerurl includes");
                //console.log(routerUrl.includes(node.data.EntityId));
                this.tree.treeModel.getFocusedNode().blur();

              } else {
                entityId=node.data.EntityId;
              }
            }
          })
        }
      }

      //activate selected node
      if(entityId != "") {
        this.ActivateEntityId(entityId);
      }
      else{
         this.highlightRouterEntityId();
      }
    }
    catch(e){

    }
  }
  highlightRouterEntityId(){
    this.route.queryParams.pipe(this.compUntilDestroyed()).subscribe((params:any) => {
      if(params && params.EntityId){
        this.ActivateEntityId(params.EntityId);
      }
    })
  }

  ActivateEntityId(entityId){
    var node = this.getNodeByEntityId(entityId);
  if(node){
    this.ActiveTreeNode = node;
    node.setActiveAndVisible(true);
   }
  }

  deactivateAllActiveNodes(message: any) {
    try {
      if (this.tree && this.tree.treeModel) {
        var treeNodes = this.tree.treeModel.getActiveNodes();
        if (treeNodes && treeNodes.length != 0) {
          treeNodes.forEach((node) => {
            if (node && node.isActive) {
              node.toggleActivated()
              this.tree.treeModel.getFocusedNode().blur();
            }
          })
        }
      }

    }
    catch (e) {
      console.error(e);
    }

  }

  callshiftclick(tree, node, $event) {
    if (!$event.shiftKey) {
      this.from = node.index;
    }
    if ($event.shiftKey) {  //click with Shift
      this.isShiftAndCtrlSelectedNodeAvailable=true;
      for (var index = 0; index < this.previousnodes.length; index++) {
        TREE_ACTIONS.DEACTIVATE(tree, this.previousnodes[index], $event);
      }
      this.to = node.index
      if (this.previousid != node.parent.data.uuid) {
        this.from = 0;
        this.previousid = node.parent.data.uuid;
      }
      var nodes = node.parent ? node.parent.children : tree.roots
      var start = this.from < this.to ? this.from : this.to
      var end = this.from > this.to ? this.from : this.to
      for (var index = start; index <= end; index++) {
        if (!nodes[index].isActive) {
          TREE_ACTIONS.TOGGLE_ACTIVE_MULTI(tree, nodes[index], $event);
        }
        this.previousnodes = [];
        if (nodes[index].isActive) {
          this.previousnodes.push(nodes[index]);
        }
      }

    }
    else if ($event.ctrlKey) { //click with CTRL
      this.isShiftAndCtrlSelectedNodeAvailable=true;

      TREE_ACTIONS.TOGGLE_ACTIVE_MULTI(tree, node, $event)

      if (node.isActive) {
        this.previousnodes.push(node);
      }
      this.previousid = node.parent.data.uuid;
    }
    else {
      TREE_ACTIONS.ACTIVATE(tree, node, $event);
      if (node.isActive) {
        this.previousnodes.push(node);
      }
      this.previousid = node.parent.data.uuid;
    }
  }
  compUntilDestroyed():any {
    return takeUntil(this.takeUntilDestroyObservables);
    }

  ngOnDestroy() {

    this.takeUntilDestroyObservables.next();
    this.takeUntilDestroyObservables.complete();
  }
}

