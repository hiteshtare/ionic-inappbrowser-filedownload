import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public args: {
    url: string,
    targetPath: string,
    options: any
  };

  constructor(private iab: InAppBrowser, private window: Window, private transfer: FileTransfer, private file: File) {
    const url = "http://www.principlesofeconometrics.com/excel.htm";
    let windowref = this.window.open(url, '_blank', 'location=no,closebuttoncaption=Cerrar,toolbar=yes,enableViewportScale=yes');

    if (windowref == null)
      return;
    windowref.addEventListener('loadstart', (e) => {
      var url = e['url'];
      alert(`Event: loadstart with URL = ${url}`);

      var extension = url.substr(url.length - 4);
      if (extension == '.xls') {
        alert(`File Extension : xls found`);

        const targetPath = this.file.externalRootDirectory + "DNA.xls";
        const options = {};
        this.args = {
          url: url,
          targetPath: targetPath,
          options: options
        };
        windowref.close(); // close window or you get exception
        document.addEventListener('deviceready', () => {
          alert(`Event: deviceready executed`);

          setTimeout(() => {
            this.downloadFile(this.args); // call the function which will download the file 1s after the window is closed, just in case..
          }, 1000);
        });
      }
    });
  }

  downloadFile(args) {
    alert(`Function: downloadFile executed`)

    const fileTransfer = this.transfer.create();

    fileTransfer.download(args.url, args.targetPath).then((entry) => {
      alert(`File Downloaded Successfully!`);
    }, (error) => {
      alert(error);
    });
  }

  openBlank() {
    this.iab.create(`http://www.principlesofeconometrics.com/excel.htm`, `_system`);
  }
}
