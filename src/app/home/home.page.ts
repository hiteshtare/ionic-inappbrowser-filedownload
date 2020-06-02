import { Component } from '@angular/core';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';
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

  public iabObj: InAppBrowserObject;
  public windowref = null;
  public url = "http://www.principlesofeconometrics.com/excel.htm";
  // public url = "https://analytics.qa1.labs.global.omnipresence.io/";

  constructor(private iab: InAppBrowser, private window: Window, private transfer: FileTransfer, private file: File) {
    this.windowref = this.window.open(this.url, '_blank', 'location=no,closebuttoncaption=Cerrar,toolbar=yes,enableViewportScale=yes');
    // public windowref = this.window.open("https://analytics.qa1.labs.global.omnipresence.io/", '_blank', 'location=no,closebuttoncaption=Cerrar,toolbar=yes,enableViewportScale=yes');
    // this.iabObj = this.iab.create(`https://analytics.qa1.labs.global.omnipresence.io/`, `_blank`);

    if (this.windowref == null)
      return;

    //+++++++++++++++ Add an event listener for customExport +++++++++++++++//
    document.addEventListener("customExport", (event) => {
      alert(`document: customExport is triggered!`);
      console.log(`document: customExport is triggered!`);
      console.debug(event);
    });

    this.windowref.addEventListener('customExport', (event) => {
      alert(`windowref: customExport is triggered!`);
      console.log(`windowref: customExport is triggered!`);
      console.debug(event);
    });
    //+++++++++++++++ Add an event listener for customExport +++++++++++++++//

    this.windowref.addEventListener('loadstart', (e) => {

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
        this.windowref.close(); // close window or you get exception
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
    const iabObj = this.iab.create(this.url, '_blank').on('loadstart').subscribe(() => {
      alert(`iab: customExport is triggered!`);
    });
  }
}
