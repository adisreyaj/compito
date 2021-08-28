import { Directive, EventEmitter, HostBinding, HostListener, NgModule, Output } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[fileDnD]',
})
export class FileDndDirective {
  dragging = 0;
  @HostBinding('class.file-over')
  fileOver = false;

  @Output() fileDropped = new EventEmitter<FileList>();

  // Dragover listener
  @HostListener('dragenter', ['$event'])
  onDragEnter(evt: DragEvent) {
    this.dragging++;
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragover', ['$event'])
  onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragging--;
    if (this.dragging === 0) {
      this.fileOver = false;
    }
  }

  // Drop listener
  @HostListener('drop', ['$event'])
  public ondrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    const files = evt.dataTransfer?.files;
    if (files && files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}

@NgModule({
  declarations: [FileDndDirective],
  exports: [FileDndDirective],
})
export class FileDndModule {}
