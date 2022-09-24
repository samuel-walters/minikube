# At the time of writing, "2.3.0" is the latest version of Vagrant.
# This line can help with compatibility issues.
Vagrant.require_version "= 2.3.0"

# The "2" refers to the version of the configuration object "config".
# The settings within config.vm modify the configuration of the VM.
Vagrant.configure("2") do |config|
    # This configures what box the VM will be brought up against.
    # (A Vagrant Box is a clone of a base operating system image.)
    # Available Vagrant Boxes: https://app.vagrantup.com/boxes/search
    # (ilionx/ubuntu2004-minikube comes with minikube (1.26.1) installed -
    # as well as docker (5:20.10.17~3-0~ubuntu-focal), 
    # kubectl (1.25.0-00), kubetail (1.6.15) and even helm (3.9.4).)
    config.vm.box = "ilionx/ubuntu2004-minikube"

    # Latest version of the ilionx/ubuntu2004-minikube box at the moment.
    config.vm.box_version = "1.2.4-20220825"

    # The hostname the VM machine should have.
    config.vm.hostname = "minikube-task-host"

    # Sets up a private network.
    # Make sure this static IP does not collide with any other machines on the same network.
    # (For example, use a command like "arp -a" in Windows Command Prompt to list IPs.)
    config.vm.network "private_network", ip: "192.168.50.4"

    # This message shows after "vagrant up".
    config.vm.post_up_message = "Useful instructions here."

    # Configures settings specific to virtualbox
    config.vm.provider "virtualbox" do |v|
        # This name will appear in the VirtualBox GUI.
        v.name = "minikube-task-vm"
        # (Set this variable to true when debugging.)
        v.gui = false
        # Sets the host CPU execution cap to 50%. In other words, no matter how much 
        # CPU is used in the VM, no more than 50% will be used on the host machine.
        v.customize ["modifyvm", :id, "--cpuexecutioncap", "50"]
        # (The default memory limit for minikube is 2GB and the CPU limit is 2.)
        v.memory = 2048
        v.cpus = 2
    end
    
    # Allows folders on the host machine to be synced to the guest machine.
    # (Type "rsync" does a one-time one-way sync from the host to the VM.)
    # (node_modules gets excluded because otherwise "npm install" causes installation errors.)
    # (First parameter is host path, second is VM path.)
    config.vm.synced_folder ".", "/vagrant", type: "rsync", rsync__exclude: [".git/", ".gitignore", "/server/node_modules/", "Vagrantfile"]
end