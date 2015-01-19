class triage::runtime {
  
  class { 'java':
    distribution => 'jre',
  }

  class { 'nginx': }
  
  nginx::resource::upstream { 'triage_app':
    members => ['localhost:8080'],
  }

  nginx::resource::vhost { 'triage.com':
    proxy => 'http://triage_app',
    proxy_set_header => ['Host $http_host'],
    before => Exec['config-hack']
  }

  exec { 'config-hack':
    command => "sed -i.bak s/'Host $host'/'Host $http_host'/g /etc/nginx/sites-available/triage.com.conf",
    path =>  [ '/bin', '/usr/bin', '/usr/local/bin' ],
    logoutput => 'true'
  }


}