class triage::service {

  user { 'triage':
    ensure => 'present',
  }

  file { ['/var/www/', '/var/www/triage']:
    ensure => 'directory',
    mode => "a+w"
  }

  wget::fetch { "download-jar":
    source      => 'https://nicopaez.ci.cloudbees.com/view/ejemplos/job/triage-release/lastSuccessfulBuild/artifact/triage.jar',
    destination => '/var/www/triage/triage.jar',
    timeout     => 0,
    verbose     => true,
    require => File['/var/www/', '/var/www/triage'],
    before => Service['triage']
  }

  file { '/etc/init/triage.conf':
    ensure => present,
    content => template("triage/triage.conf.erb")
  }

  service { 'triage':
    ensure => running,
    provider => 'upstart',
    require => File['/etc/init/triage.conf']
  }

}