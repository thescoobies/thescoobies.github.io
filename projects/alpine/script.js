window.onload = function()
{
    var emulator = new V86({
        wasm_path: "./build/v86.wasm",
        memory_size: 1024 * 1024 * 1024,
        vga_memory_size: 16 * 1024 * 1024,
        screen_container: document.getElementById("screen_container"),
        bios: { url: "./bios/seabios.bin" },
        vga_bios: { url: "./bios/vgabios.bin" },
        filesystem: {
            baseurl: "./images/alpine-rootfs-flat",
            basefs: "./images/alpine-fs.json",
        },
        net_device: {
            relay_url: "wisp://68.51.36.237:6767",
            type: "virtio"
        },
        autostart: true,
        bzimage_initrd_from_filesystem: true,
        cmdline: "rw root=host9p rootfstype=9p rootflags=trans=virtio,cache=loose modules=virtio_pci tsc=reliable",
    });
    document.getElementById("save_file").onclick = async function()
    {
        const new_state = await emulator.save_state();
        var a = document.createElement("a");
        a.download = "v86state.bin";
        a.href = window.URL.createObjectURL(new Blob([new_state]));
        a.dataset.downloadurl = "application/octet-stream:" + a.download + ":" + a.href;
        a.click();
        this.blur();
    };
    document.getElementById("restore_file").onclick = async function()
    {
        document.getElementById("restore_file2").click();
        this.blur();
    };
    document.getElementById("restore_file2").onchange = function()
    {
        if(this.files.length)
        {
            var filereader = new FileReader();
            emulator.stop();
            filereader.onload = async function(e)
            {
                await emulator.restore_state(e.target.result);
                emulator.run();
            };
            filereader.readAsArrayBuffer(this.files[0]);
            this.value = "";
        }
        this.blur();
    };
    document.getElementById("file_upload").onclick = async function()
    {
        const files = await window.showOpenFilePicker({multiple:true});
        files.forEach(fileHandle => {
            var filePromise = fileHandle.getFile();
            filePromise.then((file) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    var data = (new TextEncoder('UTF-8')).encode(e.target.result);
                    emulator.create_file("/root/downloads/"+file.name, data);
                    alert("uploaded to /root/downloads/"+file.name);
                };
                reader.readAsText(file)
            });
        });
        this.blur();
    };
};