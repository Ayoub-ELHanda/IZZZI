# Networking Module
module "networking" {
  source = "./modules/networking"

  project_name = var.project_name
  environment  = var.environment
  region       = var.region
  vpc_cidr     = var.vpc_cidr
  common_tags  = var.common_tags
}

# Droplet Module
module "droplet" {
  source = "./modules/droplet"

  project_name     = var.project_name
  environment      = var.environment
  region           = var.region
  vpc_id           = module.networking.vpc_id
  droplet_size     = var.droplet_size
  droplet_image    = var.droplet_image
  ssh_public_key   = var.ssh_public_key
  ssh_key_name     = var.ssh_key_name
  enable_monitoring = var.enable_monitoring
  enable_backups   = var.enable_backups
  enable_ipv6      = var.enable_ipv6
  do_project_id    = var.do_project_id
  common_tags      = var.common_tags
}

# Firewall Module
module "firewall" {
  source = "./modules/firewall"

  project_name      = var.project_name
  environment       = var.environment
  droplet_ids       = [module.droplet.droplet_id]
  vpc_cidr          = module.networking.vpc_cidr
  allowed_ssh_ips   = var.allowed_ssh_ips
  common_tags       = var.common_tags
}

# DNS Module (optional)
module "dns" {
  source = "./modules/dns"
  count  = var.domain_name != "" ? 1 : 0

  domain_name = var.domain_name
  droplet_ip  = module.droplet.droplet_ip
}

# Spaces Module (optional)
module "spaces" {
  source = "./modules/spaces"
  count  = var.create_spaces ? 1 : 0

  project_name = var.project_name
  environment  = var.environment
  region       = var.region
  common_tags  = var.common_tags
}
