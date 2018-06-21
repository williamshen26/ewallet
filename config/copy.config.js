module.exports = {
  copyMaterial: {
    src: ['{{ROOT}}/node_modules/@angular/material/prebuilt-themes/**/*'],
    dest: '{{WWW}}/build/~@angular/material/prebuilt-themes'
  },
  copyFontAwesome: {
    src: ['{{ROOT}}/node_modules/font-awesome/**/*'],
    dest: '{{WWW}}/build/~font-awesome'
  }
}
