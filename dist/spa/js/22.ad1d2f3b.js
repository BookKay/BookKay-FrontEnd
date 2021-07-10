(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[22],{a119:function(t,e,r){"use strict";r.r(e);var i=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("q-page",{staticClass:"flex"},[r("div",{staticClass:"col"},[r("div",{staticClass:"row q-ml-lg"},[r("h2",{staticClass:"q-mb-sm"},[t._v("Manuscript Configs")])]),r("q-separator",{attrs:{inset:""}}),r("div",{staticClass:"row-12 q-ma-lg"},[r("q-input",{ref:"titleInput",staticStyle:{"font-size":"1rem"},attrs:{label:"Title:","label-color":"primary",filled:"",rules:[function(t){return null!==t&&""!==t||"Please type the title"},function(t){return t.length<=100||"Title must be smaller than 100"}]},on:{input:t.editTitle,blur:function(e){return t.editTitle(!0)}},model:{value:t.title,callback:function(e){t.title=e},expression:"title"}})],1),r("div",{staticClass:"row-12 q-mx-lg"},[r("q-input",{ref:"descriptionInput",staticStyle:{"font-size":"1rem"},attrs:{label:"Description:","label-color":"primary",filled:"",rules:[!0],autogrow:""},on:{input:t.editDescription,blur:function(e){return t.editDescription(!0)}},model:{value:t.description,callback:function(e){t.description=e},expression:"description"}})],1),t.$store.getters["write/manuscriptProperty"]("front_cover")?r("q-btn",{staticClass:"q-ma-lg",attrs:{outline:"",color:"positive",label:"Front Cover",icon:"check_circle"},on:{click:function(e){t.clear_cover=!0,t.coverToBeCleared="front_cover"}}}):r("file-uploader",{staticClass:"q-ma-lg",attrs:{label:"Front Cover"},on:{upload:t.handleUpload}}),t.$store.getters["write/manuscriptProperty"]("back_cover")?r("q-btn",{staticClass:"q-ma-lg",attrs:{outline:"",color:"positive",label:"Back Cover",icon:"check_circle"},on:{click:function(e){t.clear_cover=!0,t.coverToBeCleared="back_cover"}}}):r("file-uploader",{staticClass:"q-ma-lg",attrs:{label:"Back Cover"},on:{upload:t.handleUpload}}),r("div",{staticClass:"row-12 q-ma-md"},[r("q-tree",{ref:"optionsTree",staticClass:"col-12 col-sm-6",attrs:{nodes:t.options,"node-key":"body","tick-strategy":"strict",ticked:t.ticked},on:{"update:ticked":[function(e){t.ticked=e},t.handleTicked]}})],1),r("div",[r("q-btn",{staticClass:"q-ma-md",attrs:{color:"primary",label:"Publish",size:"large"},on:{click:function(e){t.confirm_publish=!0}}},[t.loading?r("q-spinner-hourglass",{attrs:{color:"white",size:"1.2em"}}):t._e()],1)],1),r("q-dialog",{ref:"clearCoverDialog",model:{value:t.clear_cover,callback:function(e){t.clear_cover=e},expression:"clear_cover"}},[r("q-card",[r("q-card-section",{staticClass:"row items-center"},[r("span",{staticClass:"q-ml-sm"},[t._v("Are you sure you want delete? Image of\n            "+t._s(t.coverToBeCleared.replace("_"," ").toUpperCase())+" will be\n            cleared")])]),r("q-card-actions",{attrs:{align:"right"}},[r("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Cancel",color:"primary"}}),r("q-btn",{attrs:{flat:"",icon:"delete",label:"Delete",color:"negative"},on:{click:t.clearCover}})],1)],1)],1),r("q-dialog",{ref:"deleteDialog",attrs:{persistent:""},model:{value:t.confirm_untick,callback:function(e){t.confirm_untick=e},expression:"confirm_untick"}},[r("q-card",[r("q-card-section",{staticClass:"row items-center"},[r("span",{staticClass:"q-ml-sm"},[t._v("Are you sure you want delete? All related and children data of\n            the "+t._s(t.difference_option_label)+" will be lost")])]),r("q-card-actions",{attrs:{align:"right"}},[r("q-btn",{attrs:{flat:"",label:"Cancel",color:"primary"},on:{click:t.cancelDelete}}),r("q-btn",{attrs:{flat:"",icon:"delete",label:"Delete",color:"negative"},on:{click:t.confirmDelete}})],1)],1)],1),r("q-dialog",{ref:"publishDialog",attrs:{persistent:""},model:{value:t.confirm_publish,callback:function(e){t.confirm_publish=e},expression:"confirm_publish"}},[r("q-card",[r("q-card-section",{staticClass:"row items-center"},[r("span",{staticClass:"q-ml-sm"},[t._v("Are you sure you want publish? The contents of the published book\n            cannot be altered or deleted after it had been published.")])]),r("q-card-actions",{attrs:{align:"right"}},[r("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Cancel",color:"primary"}}),r("q-btn",{attrs:{flat:"",icon:"publish",label:"Publish",color:"positive"},on:{click:t.confirmPublish}})],1)],1)],1)],1)])},o=[],s=(r("a4d3"),r("e01a"),r("4de4"),r("caad"),r("2532"),r("99af"),r("a434"),r("fb6a"),r("d3b7"),function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("q-file",{staticStyle:{"max-width":"300px"},attrs:{value:t.files,label:t.$props.label,outlined:"",multiple:"",append:t.$props.multiple,accept:".jpg, .png, .gif, image/*","max-file-size":"10000000",clearable:!t.isUploading},on:{input:t.updateFiles,rejected:t.onRejected},scopedSlots:t._u([{key:"file",fn:function(e){var i=e.index,o=e.file;return[r("q-chip",{staticClass:"full-width q-my-xs bg-grey",attrs:{removable:t.isUploading&&t.uploadProgress[i].percent<1,square:""},on:{remove:function(e){return t.cancelFile(i)}}},[r("q-linear-progress",{staticClass:"absolute-full full-height",attrs:{value:t.uploadProgress[i].percent,color:t.uploadProgress[i].color,"track-color":"grey-2"}}),r("q-avatar",[r("q-icon",{attrs:{name:t.uploadProgress[i].icon}})],1),r("div",{staticClass:"ellipsis relative-position"},[t._v("\r\n          "+t._s(o.name)+"\r\n        ")]),r("q-tooltip",[t._v("\r\n          "+t._s(o.name)+"\r\n        ")])],1)]}},t.canUpload?{key:"after",fn:function(){return[r("q-btn",{attrs:{color:"primary",dense:"",icon:"cloud_upload",round:"",disable:!t.canUpload,loading:t.isUploading},on:{click:t.upload}})]},proxy:!0}:null],null,!0)})}),n=[],a=r("ded3"),c=r.n(a),l=(r("b0c0"),r("d81d"),{name:"FileUploader",props:{label:{type:String,default:"Pick Files"},multiple:{type:Boolean,default:!1}},data:function(){return{files:null,uploadProgress:[],uploading:null,error:!1,percent:0}},computed:{isUploading:function(){return null!==this.uploading},canUpload:function(){return null!==this.files}},methods:{onRejected:function(t){for(var e=0;e<t.length;e++){var r=t[e];this.$q.notify({type:"negative",message:"".concat(r.file.name," was rejected as it fails ").concat(r.failedPropValidation.replaceAll("-"," ")," validation")})}},cancelFile:function(t){this.uploadProgress[t]=c()(c()({},this.uploadProgress[t]),{},{error:!0,color:"orange-2"})},updateFiles:function(t){this.files=t,this.uploadProgress=(t||[]).map((function(t){return{error:!1,color:"green-2",percent:0,icon:0===t.type.indexOf("video/")?"movie":0===t.type.indexOf("image/")?"photo":0===t.type.indexOf("audio/")?"audiotrack":"insert_drive_file"}}))},upload:function(){var t=this;clearTimeout(this.uploading);var e={files:this.files,type:this.$props.label};this.$emit("upload",e,(function(e){e?t.percent=1:t.error=!0}));var r=this.uploadProgress.every((function(t){return 1===t.percent}));this.uploadProgress=this.uploadProgress.map((function(t){return c()(c()({},t),{},{error:!1,color:"green-2",percent:!0===r?0:t.percent})})),this.__updateUploadProgress()},__updateUploadProgress:function(){var t=this,e=!0;this.uploadProgress=this.uploadProgress.map((function(r){if(r.percent=t.percent,1===r.percent||!0===r.error)return r;var i=Math.min(1,r.percent+Math.random()/10),o=t.error;return!1===o&&i<1&&!0===e&&(e=!1),t.percent=i,c()(c()({},r),{},{error:o,color:!0===o?"red-2":"green-2",percent:i})})),this.uploading=!0!==e?setTimeout(this.__updateUploadProgress,300):null,console.log(this.files)}},beforeDestroy:function(){clearTimeout(this.uploading)}}),p=l,u=r("2877"),d=r("7d53"),h=r("b047"),f=r("6b1d"),g=r("cb32"),m=r("0016"),v=r("05c0"),b=r("9c40"),_=r("eebe"),y=r.n(_),w=Object(u["a"])(p,s,n,!1,null,null,null),k=w.exports;y()(w,"components",{QFile:d["a"],QChip:h["a"],QLinearProgress:f["a"],QAvatar:g["a"],QIcon:m["a"],QTooltip:v["a"],QBtn:b["a"]});var $={name:"ManuscriptPage",components:{FileUploader:k},data:function(){return{title:this.$store.getters["write/manuscriptProperty"]("title"),description:this.$store.getters["write/manuscriptProperty"]("description"),frontCover:this.$store.getters["write/manuscriptProperty"]("front_cover"),backCover:this.$store.getters["write/manuscriptProperty"]("back_cover"),options:[{label:"Contain Characters",body:"contain_character"},{label:"Contain Front Matter",body:"contain_front_matter"},{label:"Contain Chapters",body:"contain_chapter"},{label:"Contain Back Matter",body:"contain_back_matter"},{label:"Automatically add titles as h2 tags",body:"auto_add_title"}],configs:this.$store.getters["write/manuscriptProperty"]("configs"),ticked:this.$store.getters["write/getConfigs"],selectedOptions:this.$store.getters["write/getConfigs"],loading:!1,difference_option:"",difference_option_label:"",confirm_untick:!1,confirm_publish:!1,clear_cover:!1,coverToBeCleared:""}},methods:{editTitle:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];!e&&this.$store.getters["write/isLoading"]||this.$store.dispatch("write/editManuscript",{title:this.title}).then((function(t){})).catch((function(e){t.$q.notify({color:"negative",position:"top",message:e.response.data.message||"Something went wrong",icon:"error"})}))},editDescription:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];!e&&this.$store.getters["write/isLoading"]||this.$store.dispatch("write/editManuscript",{description:this.description}).then((function(t){})).catch((function(e){t.$q.notify({color:"negative",position:"top",message:e.response.data.message||"Something went wrong",icon:"error"})}))},clearCover:function(){var t=this;if(!this.$store.getters["write/isLoading"]){var e={};e[this.coverToBeCleared]="",this.$store.dispatch("write/editManuscript",e).then((function(t){})).catch((function(e){t.$q.notify({color:"negative",position:"top",message:e.response.data.message||"Something went wrong",icon:"error"})})),this.clear_cover=!1}},handleTicked:function(t){var e=this,r=this.selectedOptions.filter((function(t){return!e.ticked.includes(t)}));0!=r.length&&(this.difference_option=r[0],this.difference_option_label=this.$refs.optionsTree.getNodeByKey(this.difference_option)["label"],this.confirm_untick=!0);var i=this.ticked.filter((function(t){return!e.selectedOptions.includes(t)}));if(0!=i.length){this.selectedOptions.push(o);var o=i[0];this.configs[o]=!0,this.$store.dispatch("write/editConfigs",this.configs).then((function(t){})).catch((function(t){e.$q.notify({color:"negative",position:"top",message:t.response.data.message||"Something went wrong",icon:"error"})}))}},handleUpload:function(t,e){var r=this,i=new FormData,o=t.files[0],s=t.type,n=s.toLowerCase().replaceAll(" ","_"),a="BookKay/".concat(s,"/").concat(n,"_").concat(this.$store.getters["write/manuscriptProperty"]("id"));i.append("file",o,a),this.$store.dispatch("write/uploadMedia",i).then((function(t){var i=t.data.secure_url;e(!0);var o={};o[n]=i,r.$store.dispatch("write/editManuscript",o).then((function(t){})).catch((function(t){r.$q.notify({color:"negative",position:"top",message:t.response.data.message||"Something went wrong",icon:"error"})}))})).catch((function(t){e(!1);var i="";try{i=t.response.data.message}catch(o){i="Something went wrong. Please try refreshing the page"}r.$q.notify({color:"negative",position:"top",message:i,icon:"error"})}))},confirmDelete:function(){var t=this,e=this.selectedOptions.indexOf(this.difference_option);e>-1&&this.selectedOptions.splice(e,1),this.confirm_untick=!1;var r=this.difference_option;this.configs[r]=!1,this.$store.dispatch("write/editConfigs",this.configs).then((function(i){var o="";switch(r){case"contain_character":o="characters";break;case"contain_chapter":o="chapters";break;case"contain_front_matter":o="front_matters";break;case"contain_back_matter":o="back_matters";break;default:}var s=t.$store.getters["write/manuscriptProperty"](o);if(""!=o)for(var n=0;n<s.length;n++){var a=s[n],c={id:a.id,type:o.slice(0,-1)};t.$store.dispatch("write/deleteChapter",c).then((function(t){})).catch((function(r){t.$q.notify({color:"negative",position:"top",message:r.response.data.message||"Something went wrong",icon:"error"}),t.chapters.splice(e,0,chapter)}))}})).catch((function(e){t.$q.notify({color:"negative",position:"top",message:e.response.data.message||"Something went wrong",icon:"error"})}))},cancelDelete:function(){this.ticked.push(this.difference_option),this.confirm_untick=!1},confirmPublish:function(){var t=[];if(this.$store.getters["write/manuscriptProperty"]("title")||t.push("title"),this.$store.getters["write/manuscriptProperty"]("description")||t.push("description"),this.$store.getters["write/manuscriptProperty"]("front_cover")||t.push("front_cover"),this.$store.getters["write/manuscriptProperty"]("back_cover")||t.push("back_cover"),this.$store.getters["write/manuscriptProperty"]("title")&&this.$store.getters["write/manuscriptProperty"]("description")&&this.$store.getters["write/manuscriptProperty"]("front_cover")&&this.$store.getters["write/manuscriptProperty"]("back_cover"))this.loading=!0,this.publish();else{var e="Please fill in these information to publish - "+t.toString();this.$q.notify({type:"negative",message:e})}this.confirm_publish=!1},publish:function(){var t=this,e={title:this.$store.getters["write/manuscriptProperty"]("title"),description:this.$store.getters["write/manuscriptProperty"]("description"),front_cover:this.$store.getters["write/manuscriptProperty"]("front_cover"),back_cover:this.$store.getters["write/manuscriptProperty"]("back_cover"),author_id:this.$store.getters["write/manuscriptProperty"]("author").id,price:0,text:this.$store.getters["write/manuscriptProperty"]("text"),publish_date:(new Date).toISOString,contain_character:this.$store.getters["write/manuscriptProperty"]("configs").contain_character,contain_front_matter:this.$store.getters["write/manuscriptProperty"]("configs").contain_front_matter,contain_chapter:this.$store.getters["write/manuscriptProperty"]("configs").contain_chapter,contain_back_matter:this.$store.getters["write/manuscriptProperty"]("configs").contain_back_matter,auto_add_title:this.$store.getters["write/manuscriptProperty"]("configs").auto_add_title};this.$store.dispatch("write/publishBook",e).then((function(e){console.log("data",e);var r=e.data.book.id;t.assembleBook(r),t.loading=!1,t.$q.notify({color:"positive",position:"top",message:"Yay! Your book has been published successfully on our bookstore",icon:"error"}),t.$router.push({name:"app-read"})})).catch((function(e){console.log(e);var r="";try{r=e.response.data.message}catch(i){r="Something went wrong. Please try refreshing the page"}t.$q.notify({color:"negative",position:"top",message:r,icon:"error"}),t.loading=!1}))},assembleBook:function(t){if(this.$store.getters["write/manuscriptProperty"]("configs").contain_character)for(var e=this.$store.getters["write/manuscriptProperty"]("characters"),r=0;r<e.length;r++){var i=e[r];i.book_id=t,this.postChapter(i,"characters")}if(this.$store.getters["write/manuscriptProperty"]("configs").contain_front_matter){var o=this.$store.getters["write/manuscriptProperty"]("front_matters");for(r=0;r<o.length;r++){var s=o[r];s.book_id=t,this.postChapter(s,"Front Matter")}}if(this.$store.getters["write/manuscriptProperty"]("configs").contain_chapter){var n=this.$store.getters["write/manuscriptProperty"]("chapters");for(r=0;r<n.length;r++){var a=n[r];a.book_id=t,this.postChapter(a,"Chapter")}}if(this.$store.getters["write/manuscriptProperty"]("configs").contain_back_matter){var c=this.$store.getters["write/manuscriptProperty"]("back_matters");for(r=0;r<c.length;r++){var l=c[r];l.book_id=t,this.postChapter(l,"Back Matter")}}},postChapter:function(t,e){var r=this,i={chapter:t,type:e,isBook:!0};this.$store.dispatch("write/addChapter",i).then((function(t){})).catch((function(t){r.$q.notify({color:"negative",position:"top",message:t.response.data.message||"Something went wrong",icon:"error"})}))},onRejected:function(t){this.$q.notify({type:"negative",message:"".concat(t.length," file(s) did not pass validation constraints")})}}},P=$,C=r("9989"),q=r("eb85"),x=r("27f9"),S=r("7f41"),T=r("9149"),B=r("24e8"),D=r("f09f"),Q=r("a370"),U=r("4b7e"),F=r("7f67"),M=Object(u["a"])(P,i,o,!1,null,null,null);e["default"]=M.exports;y()(M,"components",{QPage:C["a"],QSeparator:q["a"],QInput:x["a"],QBtn:b["a"],QTree:S["a"],QSpinnerHourglass:T["a"],QDialog:B["a"],QCard:D["a"],QCardSection:Q["a"],QCardActions:U["a"]}),y()(M,"directives",{ClosePopup:F["a"]})}}]);