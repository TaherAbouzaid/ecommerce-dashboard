import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { Tree } from 'primeng/tree';
import { NodeService } from '../../services/nodeservice/nodeservice.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
  imports: [RouterLink, TreeModule, Tree],
  providers: [NodeService]
})
export class SideBarComponent implements OnInit {
  files!: TreeNode[];

    constructor(private NodeService: NodeService) {}

    ngOnInit() {
        this.NodeService.getFiles().then((data) => (this.files = data));
    }
}
