const fs = require('fs-extra');
const path = require('path');

const DIR = path.join(__dirname, '../');

/**
 * This hook removes whitelist from FileTransfer.java
 * see : https://github.com/apache/cordova-plugin-file-transfer/issues/345
 */
module.exports = function main(ctx) {
    if (!ctx.opts.platforms.includes('android')) return;

    console.log('[hook] Fix file transfer on android');

    const file = `${DIR}/platforms/android/app/src/main/java/org/apache/cordova/filetransfer/FileTransfer.java`;
    let code = `import org.apache.cordova.Whitelist;`
    let commentedOut = `//  Commented out by hook-android-fix-file-transfer.js
//  import org.apache.cordova.Whitelist;`

    let str = fs.readFileSync(file, 'utf8');
    str = str.replace(code, commentedOut);

    code = `        if (shouldAllowRequest == null) {
            try {
                Method gwl = webView.getClass().getMethod("getWhitelist");
                Whitelist whitelist = (Whitelist)gwl.invoke(webView);
                shouldAllowRequest = whitelist.isUrlWhiteListed(source);
            } catch (NoSuchMethodException e) {
            } catch (IllegalAccessException e) {
            } catch (InvocationTargetException e) {
            }
        }`
    commentedOut = `//  Commented out by hook-android-fix-file-transfer.js
//          if (shouldAllowRequest == null) {
//            try {
//                Method gwl = webView.getClass().getMethod("getWhitelist");
//                Whitelist whitelist = (Whitelist)gwl.invoke(webView);
//                shouldAllowRequest = whitelist.isUrlWhiteListed(source);
//            } catch (NoSuchMethodException e) {
//            } catch (IllegalAccessException e) {
//            } catch (InvocationTargetException e) {
//            }
//        }`

    str = str.replace(code, commentedOut);

    fs.writeFileSync(file, str, 'utf8');
};
